using Domain.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Data.Repository.Interfaces
{
    public interface IUsersRepository
    {
        Task<IEnumerable<AppUser>> GetUsers(string id);

        Task<AppUser> GetUser(string userId);
    }
}