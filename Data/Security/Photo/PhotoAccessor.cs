using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace Data.Security.Photo
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;

        public PhotoAccessor(IOptions<CloudinarySettings> options)
        {
            var account = new Account(options.Value.CloudName, options.Value.ApiKey, options.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<(string, string)> AddPhoto(IFormFile file)
        {
            if (file.Length <= 0) throw new Exception("Problem upload photo.");

            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation()
                    .Height(500)
                    .Width(500)
                    .Crop("fill")
                    .Gravity("face")
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

            return (uploadResult.PublicId, uploadResult.SecureUri.AbsoluteUri);
        }

        public string DeletePhoto(string publicId) =>
            _cloudinary
                .Destroy(new DeletionParams(publicId)).Result == "ok"
                ? "ok"
                : null;
    }
}