using Microsoft.AspNetCore.Http;

namespace API.Helpers
{
    internal static class ErrorExt
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
        }
    }
}