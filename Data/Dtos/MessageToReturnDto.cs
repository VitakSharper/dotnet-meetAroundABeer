using System;
using Domain.Identity;

namespace Data.Dtos
{
    public class MessageToReturnDto
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public string SenderDisplayName { get; set; }
        public string RecipientDisplayName { get; set; }
        public string SenderPhotoUrl { get; set; }
        public string RecipientPhotoUrl { get; set; }
        public string SenderId { get; set; }
        public string RecipientId { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSend { get; set; }
    }
}