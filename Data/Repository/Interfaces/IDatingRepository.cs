using Domain;
using System.Threading.Tasks;

namespace Data.Repository.Interfaces
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<Photo> GetPhoto(string id);
        Task<bool> Save();
    }
}