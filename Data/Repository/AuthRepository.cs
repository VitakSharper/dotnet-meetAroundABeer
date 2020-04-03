using Data.Dtos;
using Data.Interfaces;
using Data.Repository.Interfaces;
using Domain.Identity;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Data.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IUserAccessor _userAccessor;

        public AuthRepository(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IUserAccessor userAccessor
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _userAccessor = userAccessor;
        }

        public async Task<AppUser> Register(UserForRegisterDto userForRegisterDto)
        {
            if (await _userManager.FindByEmailAsync(userForRegisterDto.Email) != null) return null;

            if (await _userManager.FindByNameAsync(userForRegisterDto.Username) != null) return null;

            var user = new AppUser
            {
                DisplayName = userForRegisterDto.DisplayName,
                Email = userForRegisterDto.Email,
                UserName = userForRegisterDto.Username,
                City = userForRegisterDto.City,
                Country = userForRegisterDto.Country,
                Gender = userForRegisterDto.Gender
            };

            var result = await _userManager.CreateAsync(user, userForRegisterDto.Password);

            if (result.Succeeded)
            {
                return new AppUser
                {
                    DisplayName = userForRegisterDto.DisplayName,
                    UserName = userForRegisterDto.Username
                };
            }

            return null;
        }

        public async Task<AppUser> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userForLoginDto.Email);

            if (user == null) return null;

            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);

            return result.Succeeded
                ? user
                : null;
        }

        public async Task<AppUser> CurrentUser() =>
            await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());
    }
}