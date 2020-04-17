﻿using AutoMapper;
using Data.Dtos;
using Data.Interfaces;
using Data.Repository.Interfaces;
using Data.Security.Photo;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Persistence;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IPhotoAccessor _photoAccessor;
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;

        public PhotosController(
            DataContext context,
            IUserAccessor userAccessor,
            IPhotoAccessor photoAccessor,
            IDatingRepository datingRepository,
            IMapper mapper,
            IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _context = context;
            _userAccessor = userAccessor;
            _photoAccessor = photoAccessor;
            _datingRepository = datingRepository;
            _userAccessor = userAccessor;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;
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
            var currentUser = await _context.Users.SingleOrDefaultAsync(u =>
                u.UserName == _userAccessor.GetCurrentUsername());

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
                return CreatedAtRoute("GetPhoto", new { userId = currentUser.Id, id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add the photo.");
        }
    }
}