using AutoMapper;
using Data.Dtos;
using Data.Repository.Interfaces;
using Data.Security.Photo;
using Domain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.Extensions.Hosting;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : ControllerBase
    {
        private readonly IPhotoAccessor _photoAccessor;
        private readonly IUsersRepository _usersRepository;
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;
        private readonly FileManager _fileManager;
        private readonly string _dir;

        public PhotosController(
            IPhotoAccessor photoAccessor,
            IUsersRepository usersRepository,
            IDatingRepository datingRepository,
            IMapper mapper,
            IHostEnvironment env,
            FileManager fileManager
        )
        {
            _photoAccessor = photoAccessor;
            _usersRepository = usersRepository;
            _datingRepository = datingRepository;
            _mapper = mapper;
            _fileManager = fileManager;
            _dir = env.ContentRootPath;
        }

        [HttpGet("{id}/", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(string id)
        {
            var photoFromRepo = await _datingRepository.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost("photo")]
        public async Task<IActionResult> Add([FromForm] PhotoForCreationDto photo)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var (publicId, absoluteUri) = await _photoAccessor.AddPhoto(photo.File);

            photo.Url = absoluteUri;
            photo.Id = publicId;

            if (!currentUser.Photos.Any(p => p.IsMain))
            {
                photo.IsMain = true;
                photo.Status = true;
            }

            var photoToDb = _mapper.Map<Photo>(photo);

            currentUser.Photos.Add(photoToDb);

            var photoToReturn = _mapper.Map<PhotoForReturnDto>(photoToDb);

            if (await _datingRepository.Save())
            {
                return CreatedAtRoute("GetPhoto", new {id = photo.Id}, photoToReturn);
            }

            return BadRequest("Could not add the photo.");
        }

        [HttpPost("single")]
        public async Task<IActionResult> UploadSingleLocal([FromForm(Name = "file")] IFormFile file)
        {
            _ = file ?? throw new ArgumentException("Something went wrong.");
            var fileToReturn = await _fileManager.SaveFileOptimize(file);
            return CreatedAtRoute("GetImage",
                new {id = fileToReturn.Id, width = "480"}, fileToReturn);
        }

        [HttpGet("{id}/{width}", Name = "GetImage")]
        public IActionResult GetImage(string id, int width)
        {
            return new FileStreamResult(_fileManager.GetImageStream(id, width), "image/*");
        }

        [HttpPost("multiple")]
        public async Task<IActionResult> UploadMultipleLocal([FromForm(Name = "file")] IEnumerable<IFormFile> files)
        {
            _ = files ?? throw new ArgumentException("Something went wrong.");
            foreach (var file in files)
            {
                await using var fileStream =
                    new FileStream(Path.Combine($"{_dir}\\images", $"{Guid.NewGuid()} {file.FileName}"),
                        FileMode.Create, FileAccess.Write);
                await file.CopyToAsync(fileStream);
            }

            return Ok();
        }

        [HttpPost("{id}/main")]
        public async Task<IActionResult> Main(string id)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var photo = currentUser.Photos.FirstOrDefault(p => p.Id == id);
            if (photo == null) return NotFound();

            var mainPhoto = currentUser.Photos.FirstOrDefault(m => m.IsMain);

            if (mainPhoto != null && mainPhoto.Id == photo.Id)
                return BadRequest("Photo already the main photo.");

            photo.IsMain = true;
            if (mainPhoto != null) mainPhoto.IsMain = false;
            if (await _datingRepository.Save()) return NoContent();
            return BadRequest("Problem saving changes");
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> Status(string id,
            JsonPatchDocument<PhotoForUpdateDto> jsonPatchDocument)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var photo = currentUser.Photos.FirstOrDefault(p => p.Id == id);
            if (photo == null) return NotFound();

            var photoToPatch = _mapper.Map<PhotoForUpdateDto>(photo);

            jsonPatchDocument.ApplyTo(photoToPatch, ModelState);

            if (!TryValidateModel(photoToPatch)) return ValidationProblem(ModelState);

            var updatedPhoto = _mapper.Map(photoToPatch, photo);
            _datingRepository.Update(updatedPhoto);

            if (await _datingRepository.Save()) return NoContent();
            return BadRequest("Something went wrong.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var photo = currentUser.Photos.FirstOrDefault(p => p.Id == id);
            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("You cannot delete your main photo.");
            // if photo is hosted on cloudinary then delete it
            if (photo.Id.Length < 21)
            {
                var result = _photoAccessor.DeletePhoto(id);
                _ = result ?? throw new Exception("Problem delete the photo.");
            }

            currentUser.Photos.Remove(photo);

            if (await _datingRepository.Save()) return NoContent();

            return BadRequest("Problem deleting photo.");
        }

        [HttpGet("getPhotos")]
        public async Task<IActionResult> GetPhotos()
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var photos = currentUser.Photos.ToList();

            return Ok(photos);
        }
    }
}