using Data.Repository.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
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

        public async Task<Photo> GetPhoto(string id) =>
            await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);


        public async Task<bool> Save() =>
            await _context.SaveChangesAsync() > 0;
    }
}