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

        public AuthController(IAuthRepository authRepository, IJwtGenerator jwtGenerator)
        {
            _authRepository = authRepository;
            _jwtGenerator = jwtGenerator;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            var user = await _authRepository.Register(userForRegisterDto);
            if (user == null) return BadRequest(new { Register = "User already exists or problem creating user." });

            //return Ok(new
            //{
            //    user,
            //    token = _jwtGenerator.CreateToken(user)
            //});
            return StatusCode(201);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _authRepository.Login(userForLoginDto);
            if (user == null) return Unauthorized(new { Login = "User or password is not correct." });

            return Ok(new
            {
                token = _jwtGenerator.CreateToken(user)
            });
        }

        [HttpGet]
        public async Task<IActionResult> CurrentUser()
        {
            var user = await _authRepository.CurrentUser();
            if (user == null) return BadRequest();

            return Ok(new
            {
                user,
                Token = _jwtGenerator.CreateToken(user)
            });
        }
    }
}