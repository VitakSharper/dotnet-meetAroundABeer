using Data.Helpers.Pagination;
using Data.Repository.Interfaces;
using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Threading.Tasks;

namespace Data.Repository
{
    public class UsersRepository : IUsersRepository
    {
        private readonly DataContext _context;

        public UsersRepository(DataContext context) =>
            (_context) = (context);

        public async Task<PagedList<AppUser>> GetUsers(UserParams userParams)
        {
            var users = _context.Users;
            return await PagedList<AppUser>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }


        public async Task<AppUser> GetUser(string userId) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }
}