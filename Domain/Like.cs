using Domain.Identity;

namespace Domain
{
    public class Like
    {
        public string LikerId { get; set; }
        public string LikeeId { get; set; }
        public virtual AppUser Liker { get; set; }
        public virtual AppUser Likee { get; set; }
    }
}