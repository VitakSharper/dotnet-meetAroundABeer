using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using PhotoSauce.MagicScaler;

namespace API.Services
{
    public class FileManager
    {
        private readonly IWebHostEnvironment _environment;
        private readonly List<File> _files;

        private readonly List<(int Width, int Height)> _imgSizes = new List<(int, int)>
        {
            (480, 270),
            (640, 360),
            (1280, 720),
            (1920, 1080)
        };

        public FileManager(IWebHostEnvironment environment)
        {
            _environment = environment;
            _files = new List<File>();
        }

        public File GetFile(string id) => _files.FirstOrDefault(f => f.Id == id);

        private File GetFile(string id, int width) => _files.FirstOrDefault(f => f.Id == id && f.Width == width);

        public IEnumerable<File> GetFiles() => _files;

        public IEnumerable<string> GetOptimizedFiles() =>
            _files.Where(f => f.Width > 0).Select(f => f.Id).Distinct();

        public async Task<File> SaveFile(IFormFile file)
        {
            var saveFileName = $"{Guid.NewGuid()} {file.FileName}";
            var savePath = Path.Combine($"{_environment.WebRootPath}\\images", saveFileName);

            await using var fileStream = new FileStream(savePath, FileMode.Create, FileAccess.Write);
            await file.CopyToAsync(fileStream);
            // TO DO : write in db
            var newFile = new File
            {
                Id = saveFileName.Split(" ")[0],
                RelativePath = $"/{saveFileName}",
                GlobalPath = $"{savePath}"
            };
            _files.Add(newFile);

            return newFile;
        }

        public async Task<File> SaveFileOptimize(IFormFile file)
        {
            var settings = new ProcessImageSettings
            {
                ResizeMode = CropScaleMode.Crop,
                SaveFormat = FileFormat.Jpeg,
                JpegQuality = 100,
                JpegSubsampleMode = ChromaSubsampleMode.Subsample420
            };
            var files = new List<File>();
            foreach (var (width, height) in _imgSizes)
            {
                settings.Width = width;
                settings.Height = height;

                var saveFileName = $"{Guid.NewGuid()} {file.FileName}";
                var savePath = Path.Combine($"{_environment.WebRootPath}\\images", saveFileName);

                await using var fileStream = new FileStream(savePath, FileMode.Create);
                MagicImageProcessor.ProcessImage(file.OpenReadStream(), fileStream, settings);

                var fileToList = new File
                {
                    Id = saveFileName.Split(" ")[0],
                    RelativePath = $"/{saveFileName}",
                    GlobalPath = $"{savePath}",
                    Width = width,
                };
                // TO DO - Write to Db
                files.Add(fileToList);
            }

            if (files.Count <= 0) return null;
            _files.AddRange(files);
            var fileToReturn = files.FirstOrDefault(f => f.Width == 480);
            return fileToReturn;
        }

        public FileStream GetImageStream(string id, int width)
        {
            var path = GetFile(id, GetBestWidth(width)).GlobalPath;
            return new FileStream(path, FileMode.Open, FileAccess.Read);
        }

        private int GetBestWidth(int imgWidth)
        {
            foreach (var (width, height) in _imgSizes)
                if (width >= imgWidth)
                    return width;

            return _imgSizes[^1].Width;
        }
    }
}