using AutoMapper;
using Data.Dtos;
using Data.Interfaces;
using Data.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IAuthRepository _authRepository;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly IMapper _mapper;

        public UsersController(
            IUsersRepository usersRepository,
            IAuthRepository authRepository,
            IJwtGenerator jwtGenerator,
            IMapper mapper,
            DataContext context,
            IUserAccessor userAccessor
        )
        {
            _context = context;
            _userAccessor = userAccessor;
            (_authRepository, _jwtGenerator) = (authRepository, jwtGenerator);
            (_usersRepository, _mapper) = (usersRepository, mapper);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var currentUser = await _context.Users.SingleOrDefaultAsync(u =>
                u.UserName == _userAccessor.GetCurrentUsername());

            if (currentUser == null) return Unauthorized();

            var users = await _usersRepository.GetUsers(currentUser.Id);
            if (users == null) BadRequest();

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _usersRepository.GetUser(id);
            if (user == null) NotFound();

            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpGet("current")]
        public async Task<IActionResult> CurrentUser()
        {
            var user = await _authRepository.CurrentUser();
            if (user == null) return NotFound();

            var userToReturn = _mapper.Map<UserForDetailedDto>(user);

            return Ok(new
            {
                userToReturn
            });
        }

        [HttpPut("updateMe")]
        public async Task<IActionResult> UpdateUser(UserForUpdateDto userForUpdate)
        {
            var currentUser = await _context.Users.SingleOrDefaultAsync(u =>
                u.UserName == _userAccessor.GetCurrentUsername());

            if (currentUser == null) return Unauthorized();

            _mapper.Map(userForUpdate, currentUser);

            var updated = await _authRepository.Update(currentUser);

            var userToReturn = _mapper.Map<UserForDetailedDto>(updated);

            _ = userToReturn ??
                throw new Exception("Updating failed");

            return Ok(new {userToReturn});
        }
    }
}