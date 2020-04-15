using Data.Repository.Interfaces;
using Domain.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Data.Repository
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context) =>
            _context = context;

        public void Add<T>(T entity) where T : class =>
            _context.Add(entity);

        public void Delete<T>(T entity) where T : class =>
            _context.Remove(entity);

        public async Task<bool> Save() =>
            await _context.SaveChangesAsync() > 0;

        public async Task<IEnumerable<AppUser>> GetUsers(string id) =>
            await _context.Users.Where(u => u.Id != id).ToListAsync();

        public async Task<AppUser> GetUser(string userId) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }
}