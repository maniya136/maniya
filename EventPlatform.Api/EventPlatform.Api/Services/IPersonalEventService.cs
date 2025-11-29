using EventPlatform.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Services
{
    public interface IPersonalEventService
    {
        Task<PersonalEvent> CreatePersonalEventAsync(PersonalEvent personalEvent);
        Task<PersonalEvent> GetPersonalEventAsync(string id);
        Task<IEnumerable<PersonalEvent>> GetPersonalEventsByUserIdAsync(int userId);
        Task UpdatePersonalEventAsync(string id, PersonalEvent personalEventIn);
        Task DeletePersonalEventAsync(string id);
    }
}
