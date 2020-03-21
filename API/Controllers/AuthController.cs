using Data.Dtos;
using Data.Interfaces;
using Data.Repository.Interfaces;
using Domain.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IJwtGenerator _jwtGenerator;

        public AuthController(IAuthRepository authRepository, IJwtGenerator jwtGenerator)
        {
            _authRepository = authRepository;
            _jwtGenerator = jwtGenerator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            if (await _authRepository.UserExists(userForRegisterDto.Username))
                return BadRequest("Username already exists.");

            var userToCreate = new AppUser
            {
            };

            var createdUser = await _authRepository.Register(userToCreate, userForRegisterDto.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _authRepository.Login(userForLoginDto.Email, userForLoginDto.Password);
            if (user == null) return Unauthorized(new { Login = "User or password is not correct." });

            return Ok(new
            {
                user,
                token = _jwtGenerator.CreateToken(user)
            });
        }
    }
}