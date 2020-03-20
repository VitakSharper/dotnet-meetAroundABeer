using Data.Repository.Interfaces;
using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Threading.Tasks;

namespace Data.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<AppUser> Register(AppUser user, string password)
        {
            await _context.Users.AddAsync(user.CreatePasswordHash(password));
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<AppUser> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null) return null;

            return !user.VerifyPasswordHash(password) ? null : user;
        }

        public async Task<bool> UserExists(string username) =>
            await _context.Users.AnyAsync(u => u.Username == username);
    }
}