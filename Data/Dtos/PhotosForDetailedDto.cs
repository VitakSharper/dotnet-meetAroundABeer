using System;

namespace Data.Dtos
{
    public class PhotosForDetailedDto
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        public bool Status { get; set; }
    }
}