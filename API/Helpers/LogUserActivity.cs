using System;
using System.Threading.Tasks;
using Data.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            var repo = resultContext.HttpContext.RequestServices.GetService<IAuthRepository>();
            var user = await repo.CurrentUser();
            user.LastActive = DateTime.Now;
            await repo.Update(user);
        }
    }
}