using EventPlatform.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public interface ICustomEventRepository
    {
        Task<IEnumerable<CustomEvent>> GetAllAsync();
        Task<CustomEvent> GetByIdAsync(string id);
        Task<CustomEvent> GetByCustomEventIdAsync(int customEventId);
        Task<CustomEvent> CreateAsync(CustomEvent customEvent);
        Task<bool> UpdateAsync(CustomEvent customEvent);
        Task<bool> DeleteAsync(string id);
        Task<IEnumerable<CustomEvent>> GetByUserIdAsync(string userId);
    }
}
