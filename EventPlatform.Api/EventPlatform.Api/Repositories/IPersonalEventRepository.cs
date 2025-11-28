using EventPlatform.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public interface IPersonalEventRepository
    {
        Task<PersonalEvent> CreateAsync(PersonalEvent personalEvent);
        Task<PersonalEvent> GetByIdAsync(string id);
        Task<IEnumerable<PersonalEvent>> GetByUserIdAsync(string userId);
    }
}
