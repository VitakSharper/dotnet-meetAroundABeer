using AutoMapper;
using Data.Dtos;
using Data.Interfaces;
using Data.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly IMapper _mapper;

        public AuthController(
            IAuthRepository authRepository,
            IJwtGenerator jwtGenerator,
            IMapper mapper)
        {
            _authRepository = authRepository;
            _jwtGenerator = jwtGenerator;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            var user = await _authRepository.Register(userForRegisterDto);
            if (user == null) return BadRequest(new { Register = "User already exists or problem creating user." });

            return Ok(new
            {
                token = _jwtGenerator.CreateToken(user)
            });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var userToReturn = await _authRepository.Login(userForLoginDto);
            if (userToReturn == null) return Unauthorized(new { Login = "User or password is not correct." });
            var user = _mapper.Map<UserForDetailedDto>(userToReturn);

            return Ok(new
            {
                user,
                token = _jwtGenerator.CreateToken(userToReturn)
            });
        }
    }
}