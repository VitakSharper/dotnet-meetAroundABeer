using System;

namespace Data.Dtos
{
    public class MessageForCreationDto
    {
        public string SenderId { get; set; }
        public string RecipientId { get; set; }
        public DateTime MessageSent { get; set; }
        public string Content { get; set; }

        public MessageForCreationDto()
        {
            MessageSent = DateTime.Now;
        }
    }
}