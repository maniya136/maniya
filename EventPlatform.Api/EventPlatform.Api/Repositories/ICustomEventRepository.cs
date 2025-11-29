using EventPlatform.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public interface ICustomEventRepository
    {
        Task<IEnumerable<CustomEvent>> GetAllAsync();
        Task<CustomEvent> GetByIdAsync(string id);
        Task<CustomEvent> GetByIdAsync(int id);
        Task<CustomEvent> GetByCustomEventIdAsync(int customEventId);
        Task<CustomEvent> CreateAsync(CustomEvent customEvent);
        Task<bool> UpdateAsync(CustomEvent customEvent);
        Task<bool> DeleteAsync(string id);
        Task<bool> DeleteAsync(int id);
Task<IEnumerable<CustomEvent>> GetByUserIdAsync(string userId);
        Task<IEnumerable<CustomEvent>> GetByUserIdAsync(int userId);
        
        // New methods for event filtering
        Task<IEnumerable<CustomEvent>> GetUpcomingEventsAsync(DateTime currentDate);
        Task<IEnumerable<CustomEvent>> GetOngoingEventsAsync(DateTime currentDate);
        Task<IEnumerable<CustomEvent>> GetPastEventsAsync(DateTime currentDate);
    }
}
