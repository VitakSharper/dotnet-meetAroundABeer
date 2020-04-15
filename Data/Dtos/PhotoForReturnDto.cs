using System;

namespace Data.Dtos
{
    public class PhotoForReturnDto
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        public bool Status { get; set; }
    }
}