using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Data.Security.Photo
{
    public interface IPhotoAccessor
    {
        Task<(string, string)> AddPhoto(IFormFile file);
        string DeletePhoto(string publicId);
    }
}