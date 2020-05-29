using System.Collections.Generic;
using System.Linq;
using Data.Repository.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Threading.Tasks;
using Data.Helpers;
using Data.Helpers.Pagination;

namespace Data.Repository
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context) =>
            _context = context;

        public void Add<T>(T entity) where T : class =>
            _context.Add(entity);

        public void Delete<T>(T entity) where T : class =>
            _context.Remove(entity);

        public void Update<T>(T entity) where T : class
        {
            // HttpPatch
        }

        public async Task<Photo> GetPhoto(string id) =>
            await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

        public async Task<Like> GetLike(string userId, string recipientId) =>
            await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);

        public async Task<Message> GetMessage(string id) =>
            await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);

        public async Task<PagedList<Message>> GetMessagesForUser(RequestQueryMessageParams requestQueryMessageParams)
        {
            var messages = _context.Messages.AsQueryable();
            switch (requestQueryMessageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == requestQueryMessageParams.UserId);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == requestQueryMessageParams.UserId);
                    break;
                default:
                    messages = messages.Where(u =>
                        u.RecipientId == requestQueryMessageParams.UserId && u.IsRead == false);
                    break;
            }

            messages = messages.OrderByDescending(d => d.MessageSent);
            return await PagedList<Message>.CreateAsync(messages, requestQueryMessageParams.PageNumber,
                requestQueryMessageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(string recipientId, string currentUserId) =>
            await _context.Messages
                .Where(m => m.RecipientId == currentUserId && m.SenderId == recipientId ||
                            m.RecipientId == recipientId && m.SenderId == currentUserId)
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

        public async Task<bool> Save() =>
            await _context.SaveChangesAsync() > 0;
    }
}