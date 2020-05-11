using System;
using Domain.Identity;

namespace Domain
{
    public class Message
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSend { get; set; }
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }
        public string SenderId { get; set; }
        public string RecipientId { get; set; }
        public virtual AppUser Sender { get; set; }
        public virtual AppUser Recipient { get; set; }
    }
}