using AutoMapper;
using Data.Dtos;
using Data.Interfaces;
using Data.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;

        public UsersController(
            IDatingRepository datingRepository,
            IAuthRepository authRepository,
            IJwtGenerator jwtGenerator,
            IMapper mapper)
        {
            _authRepository = authRepository;
            _jwtGenerator = jwtGenerator;
            (_datingRepository, _mapper) = (datingRepository, mapper);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _datingRepository.GetUsers();
            if (users == null) BadRequest();

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _datingRepository.GetUser(id);
            if (user == null) NotFound();

            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpGet("current")]
        public async Task<IActionResult> CurrentUser()
        {
            var user = await _authRepository.CurrentUser();
            if (user == null) return BadRequest();

            var userToReturn = _mapper.Map<UserForListDto>(user);

            return Ok(new
            {
                userToReturn,
                token = _jwtGenerator.CreateToken(user)
            });
        }
    }
}