using AutoMapper;
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

        [HttpPost("{id}/main")]
        public async Task<IActionResult> Main(string id)
        {
            var currentUser = await _context.Users.SingleOrDefaultAsync(u =>
                u.UserName == _userAccessor.GetCurrentUsername());
            if (currentUser == null) return Unauthorized();

            var photo = currentUser.Photos.FirstOrDefault(p => p.Id == id);
            if (photo == null) return NotFound();

            var mainPhoto = currentUser.Photos.FirstOrDefault(m => m.IsMain);

            if (mainPhoto != null && mainPhoto.Id == photo.Id)
                return BadRequest("Photo already the main photo.");

            photo.IsMain = true;
            if (mainPhoto != null) mainPhoto.IsMain = false;
            if (_context.SaveChanges() > 0) return NoContent();
            return BadRequest("Problem saving changes");
        }

        [HttpPost("{id}/status")]
        public async Task<IActionResult> Status(string id)
        {
            var currentUser = await _context.Users.SingleOrDefaultAsync(u =>
                u.UserName == _userAccessor.GetCurrentUsername());
            if (currentUser == null) return Unauthorized();

            var photo = currentUser.Photos.FirstOrDefault(p => p.Id == id);
            if (photo == null) return NotFound();

            photo.Status = !photo.Status;
            if (_context.SaveChanges() > 0) return NoContent();
            return BadRequest("Problem saving changes");
        }

        [HttpGet("getPhotos")]
        public async Task<IActionResult> GetPhotos()
        {
            var currentUser = await _context.Users.SingleOrDefaultAsync(u =>
                u.UserName == _userAccessor.GetCurrentUsername());
            if (currentUser == null) return Unauthorized();
            var photos = currentUser.Photos.ToList();

            return Ok(photos);
        }
    }
}