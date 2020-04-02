using Domain.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Data.Repository.Interfaces
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> Save();
        Task<IEnumerable<AppUser>> GetUsers();
        Task<AppUser> GetUser(string userId);
    }
}