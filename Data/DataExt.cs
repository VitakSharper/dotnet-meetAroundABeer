using Domain.Identity;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Data
{
    internal static class DataExt
    {
        public static AppUser CreatePasswordHash(this AppUser user, string password)
        {
            using var hmac = new HMACSHA512();
            //user.PasswordSalt = hmac.Key;
            //user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return user;
        }

        public static bool VerifyPasswordHash(this AppUser user, string password)
        {
            using var hmac = new HMACSHA512(new byte[] { 1, 2, 3, 5 });
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

            return !computedHash.Where((t, i) => t != user.PasswordHash[i]).Any();
        }
    }
}