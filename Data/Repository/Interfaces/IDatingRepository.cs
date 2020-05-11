using System.Collections.Generic;
using Domain;
using System.Threading.Tasks;
using Data.Helpers;
using Data.Helpers.Pagination;

namespace Data.Repository.Interfaces
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<Photo> GetPhoto(string id);
        Task<Like> GetLike(string userId, string recipientId);
        Task<Message> GetMessage(string id);
        Task<PagedList<Message>> GetMessagesForUser(RequestQueryMessageParams messageParams);
        Task<IEnumerable<Message>> GetMessageThread(string recipientId, string currentUserId);
        Task<bool> Save();
    }
}