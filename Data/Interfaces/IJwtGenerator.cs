using Domain.Identity;

namespace Data.Interfaces
{
    public interface IJwtGenerator
    {
        string CreateToken(AppUser user);
    }
}