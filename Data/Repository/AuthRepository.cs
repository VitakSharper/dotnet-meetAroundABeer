using Data.Dtos;
using Data.Interfaces;
using Data.Repository.Interfaces;
using Domain.Identity;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using AutoMapper;

namespace Data.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IUserAccessor _userAccessor;
        private readonly IMapper _mapper;

        public AuthRepository(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IUserAccessor userAccessor,
            IMapper mapper
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _userAccessor = userAccessor;
            _mapper = mapper;
        }

        public async Task<AppUser> Register(UserForRegisterDto userForRegisterDto)
        {
            if (await _userManager.FindByEmailAsync(userForRegisterDto.Email) != null) return null;

            if (await _userManager.FindByNameAsync(userForRegisterDto.Username) != null) return null;

            var user = _mapper.Map<AppUser>(userForRegisterDto);

            var result = await _userManager.CreateAsync(user, userForRegisterDto.Password);

            return result.Succeeded ? user : null;
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

        public async Task<AppUser> Update(AppUser user)
        {
            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded ? user : null;
        }

        public async Task<AppUser> CurrentUser() =>
            await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());
    }
}