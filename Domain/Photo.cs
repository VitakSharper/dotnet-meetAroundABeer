using Domain.Identity;
using System;

namespace Domain
{
    public class Photo
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        public bool Status { get; set; }
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }
    }
}