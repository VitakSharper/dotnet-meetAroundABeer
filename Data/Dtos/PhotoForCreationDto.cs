using Microsoft.AspNetCore.Http;
using System;

namespace Data.Dtos
{
    public class PhotoForCreationDto
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; } = false;
        public bool Status { get; set; } = false;

        public PhotoForCreationDto()
        {
            DateAdded = DateTime.Now;
        }
    }
}