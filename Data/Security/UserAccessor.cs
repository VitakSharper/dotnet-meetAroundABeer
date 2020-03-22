using Data.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Security.Claims;

namespace Data.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _contextAccessor;

        public UserAccessor(IHttpContextAccessor contextAccessor) =>
            (_contextAccessor) = (contextAccessor);

        public string GetCurrentUsername() =>
            _contextAccessor.HttpContext.User?.Claims
                ?.FirstOrDefault(u => u.Type == ClaimTypes.NameIdentifier)?.Value;
    }
}