using Data.Helpers.Pagination;
using Domain.Identity;
using System.Threading.Tasks;

namespace Data.Repository.Interfaces
{
    public interface IUsersRepository
    {
        Task<PagedList<AppUser>> GetUsers(UserParams userParams);

        Task<AppUser> GetUser(string userId);
    }
}