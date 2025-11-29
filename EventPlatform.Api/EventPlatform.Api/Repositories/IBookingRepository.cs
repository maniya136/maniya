using EventPlatform.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public interface IBookingRepository
    {
        Task<Booking> GetByIdAsync(int id);
        Task<IEnumerable<Booking>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Booking>> GetByEventIdAsync(int eventId);
        Task<Booking> CreateAsync(Booking booking);
        Task<bool> UpdateAsync(Booking booking);
        Task<bool> DeleteAsync(int id);
    }
}
