using EventPlatform.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public interface IPersonalEventRepository
    {
        Task<PersonalEvent> CreateAsync(PersonalEvent personalEvent);
        Task<IEnumerable<PersonalEvent>> GetAllAsync();
        Task<PersonalEvent> GetByIdAsync(string id);
        Task<IEnumerable<PersonalEvent>> GetByUserIdAsync(int userId);
        Task<bool> UpdateAsync(PersonalEvent personalEvent);
        Task<bool> DeleteAsync(string id);
        Task<bool> UserExists(int userId);
        
        // New methods for event filtering
        Task<IEnumerable<PersonalEvent>> GetUpcomingEventsAsync(DateTime currentDate);
        Task<IEnumerable<PersonalEvent>> GetOngoingEventsAsync(DateTime currentDate);
        Task<IEnumerable<PersonalEvent>> GetPastEventsAsync(DateTime currentDate);
    }
}
