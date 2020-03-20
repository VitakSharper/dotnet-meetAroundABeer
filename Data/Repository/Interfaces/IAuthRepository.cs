using Domain.Identity;
using System.Threading.Tasks;

namespace Data.Repository.Interfaces
{
    public interface IAuthRepository
    {
        Task<AppUser> Register(AppUser user, string password);
        Task<AppUser> Login(string username, string password);
        Task<bool> UserExists(string username);
    }
}