using EventPlatform.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public interface ITicketRepository
    {
        Task<Ticket> GetByIdAsync(int id);
        Task<Ticket> GetByTicketNumberAsync(string ticketNumber);
        Task<IEnumerable<Ticket>> GetByBookingIdAsync(int bookingId);
        Task<IEnumerable<Ticket>> GetByEventIdAsync(int eventId);
        Task<IEnumerable<Ticket>> GetByUserIdAsync(int userId);
        Task<Ticket> CreateAsync(Ticket ticket);
        Task<bool> UpdateAsync(Ticket ticket);
        Task<bool> ValidateTicketAsync(int ticketId, int eventId);
    }
}
