using API.Helpers;
using AutoMapper;
using Data;
using Data.Dtos;
using Data.Helpers;
using Data.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IDatingRepository _datingRepository;
        private readonly IAuthRepository _authRepository;
        private readonly IMapper _mapper;

        public UsersController(
            IUsersRepository usersRepository,
            IAuthRepository authRepository,
            IMapper mapper,
            IDatingRepository datingRepository
        )
        {
            _datingRepository = datingRepository;
            _authRepository = authRepository;
            (_usersRepository, _mapper) = (usersRepository, mapper);
        }

        [HttpGet]
        [ServiceFilter(typeof(LogUserActivity))]
        public async Task<IActionResult> GetUsers([FromQuery] RequestQueryUserParams userParams)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            userParams.UserId = currentUser.Id;

            var users = await _usersRepository.GetUsers(userParams);
            if (users == null) return BadRequest();

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name = "GetUser")]
        [ServiceFilter(typeof(LogUserActivity))]
        public async Task<IActionResult> GetUser(string id)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var user = await _usersRepository.GetUser(id);
            if (user == null) NotFound();

            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpGet("current")]
        public async Task<IActionResult> CurrentUser()
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var userToReturn = _mapper.Map<UserForDetailedDto>(currentUser);
            return Ok(userToReturn);
        }

        [HttpPut("updateMe")]
        [ServiceFilter(typeof(LogUserActivity))]
        public async Task<IActionResult> UpdateUser(UserForUpdateDto userForUpdate)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            _mapper.Map(userForUpdate, currentUser);

            var updated = await _authRepository.Update(currentUser);

            var userToReturn = _mapper.Map<UserForDetailedDto>(updated);

            _ = userToReturn ??
                throw new Exception("Updating failed");

            return Ok();
        }

        [HttpPost("like/{recipientId}")]
        public async Task<IActionResult> LikeUser(string recipientId)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var like = await _datingRepository.GetLike(currentUser.Id, recipientId);
            if (like != null) return BadRequest("You already like this member.");
            if (await _usersRepository.GetUser(recipientId) == null) return NotFound();

            like = new Like
            {
                LikerId = currentUser.Id,
                LikeeId = recipientId
            };
            _datingRepository.Add<Like>(like);
            if (await _datingRepository.Save())
                return Ok();

            return BadRequest("Something went wrong.");
        }

        [HttpPost("rmLike/{recipientId}")]
        public async Task<IActionResult> RemoveLike(string recipientId)
        {
            var currentUser = await _usersRepository.GetCurrentUser();
            if (currentUser == null) return Unauthorized();

            var like = await _datingRepository.GetLike(currentUser.Id, recipientId);
            if (like == null) return NotFound("Something went wrong.");

            _datingRepository.Delete<Like>(like);
            if (await _datingRepository.Save())
                return NoContent();

            return BadRequest("Something went wrong.");
        }
    }
}