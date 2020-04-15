using Data.Repository.Interfaces;
using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Data.Repository
{
    public class UsersRepository : IUsersRepository
    {
        private readonly DataContext _context;

        public UsersRepository(DataContext context) =>
            (_context) = (context);

        public async Task<IEnumerable<AppUser>> GetUsers(string id) =>
            await _context.Users.Where(u => u.Id != id).ToListAsync();

        public async Task<AppUser> GetUser(string userId) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }
}