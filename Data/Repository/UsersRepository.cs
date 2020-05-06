using Data.Helpers;
using Data.Helpers.Pagination;
using Data.Repository.Interfaces;
using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data.Interfaces;

namespace Data.Repository
{
    public class UsersRepository : IUsersRepository
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _context;

        public UsersRepository(
            DataContext context,
            IUserAccessor userAccessor
        )
        {
            _userAccessor = userAccessor;
            (_context) = (context);
        }

        public async Task<PagedList<AppUser>> GetUsers(RequestQueryUserParams userParams)
        {
            var users = _context.Users
                .Where(u => u.Id != userParams.UserId);

            if (!string.IsNullOrEmpty(userParams.Gender))
            {
                users = users.Where(u => u.Gender == userParams.Gender);
            }

            if (userParams.Likers || userParams.Likees)
            {
                var currentUser = await GetCurrentUser();
                users = users.Where(u => currentUser
                    .GetUserLikesExt(userParams.Likers)
                    .Contains(u.Id));
                // .Select(x => )
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDateOfBirth = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDateOfBirth = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDateOfBirth && u.DateOfBirth <= maxDateOfBirth);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    case "lastActive":
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                    default:
                        break;
                }
            }

            return await PagedList<AppUser>
                .CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser> GetUser(string userId) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        public async Task<AppUser> GetCurrentUser() =>
            await _context.Users.SingleOrDefaultAsync(u =>
                u.UserName == _userAccessor.GetCurrentUsername());
    }
}