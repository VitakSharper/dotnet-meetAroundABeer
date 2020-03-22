using Data.Dtos;
using Domain.Identity;
using System.Threading.Tasks;

namespace Data.Repository.Interfaces
{
    public interface IAuthRepository
    {
        Task<AppUser> Register(UserForRegisterDto userForRegisterDto);
        Task<AppUser> Login(UserForLoginDto userForLoginDto);
        Task<AppUser> CurrentUser();
    }
}