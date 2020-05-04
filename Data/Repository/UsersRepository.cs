using Data.Helpers;
using Data.Helpers.Pagination;
using Data.Repository.Interfaces;
using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Data.Repository
{
    public class UsersRepository : IUsersRepository
    {
        private readonly DataContext _context;

        public UsersRepository(DataContext context) =>
            (_context) = (context);

        public async Task<PagedList<AppUser>> GetUsers(RequestQueryUserParams userParams)
        {
            var users = _context.Users
                .Where(u => u.Id != userParams.UserId)
                .Where(u => u.Gender == userParams.Gender);

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDateOfBirth = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDateOfBirth = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDateOfBirth && u.DateOfBirth <= maxDateOfBirth);
            }

            return await PagedList<AppUser>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser> GetUser(string userId) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }
}