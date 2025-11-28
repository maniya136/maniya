using EventPlatform.Api.Models;

namespace EventPlatform.Api.Repositories.Interfaces
{
    public interface IEventTypeRepository
    {
        Task<List<EventType>> GetAllAsync();
        Task<EventType?> GetByIdAsync(int eventTypeId);
        Task CreateAsync(EventType type);
        Task UpdateAsync(int eventTypeId, EventType type);
        Task DeleteAsync(int eventTypeId);
    }
}
