using EventPlatform.Api.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public interface IEventRepository
    {
        Task<CustomEvent> GetByIdAsync(int id);
        Task<IEnumerable<CustomEvent>> GetUpcomingEventsAsync(DateTime currentDate);
        Task<IEnumerable<CustomEvent>> GetOngoingEventsAsync(DateTime currentDate);
        Task<CustomEvent> CreateAsync(CustomEvent customEvent);
        Task<bool> UpdateAsync(CustomEvent customEvent);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
