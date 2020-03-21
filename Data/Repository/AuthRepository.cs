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

        public AuthRepository(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager) =>
            (_userManager, _signInManager) = (userManager, signInManager);

        public async Task<AppUser> Register(AppUser user, string password)
        {
            //await _context.Users.AddAsync(user.CreatePasswordHash(password));
            //await _context.SaveChangesAsync();

            return user;
        }

        public async Task<AppUser> Login(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return null;

            var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);

            return result.Succeeded
                ? user
                : null;
        }

        public Task<bool> UserExists(string username)
        {
            throw new System.NotImplementedException();
        }

        //public async Task<bool> UserExists(string username) =>
        //    await _context.Users.AnyAsync(u => u.DisplayName.ToLower() == username.ToLower());
    }
}