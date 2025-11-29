using EventPlatform.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly IMongoCollection<Ticket> _ticketsCollection;
        private readonly IMongoCollection<Counter> _countersCollection;
        private const string CounterId = "ticket";

        public TicketRepository(IMongoDatabase database, IOptions<DatabaseSettings> dbSettings)
        {
            _ticketsCollection = database.GetCollection<Ticket>("Tickets");
            _countersCollection = database.GetCollection<Counter>("counters");
        }

        private async Task<int> GetNextId()
        {
            var filter = Builders<Counter>.Filter.Eq(c => c.Id, CounterId);
            var update = Builders<Counter>.Update.Inc(c => c.SequenceValue, 1);
            var options = new FindOneAndUpdateOptions<Counter>
            {
                IsUpsert = true,
                ReturnDocument = ReturnDocument.After
            };

            var counter = await _countersCollection.FindOneAndUpdateAsync(filter, update, options);
            return counter?.SequenceValue ?? 1;
        }

        public async Task<Ticket> GetByIdAsync(int id)
        {
            return await _ticketsCollection.Find(t => t.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Ticket> GetByTicketNumberAsync(string ticketNumber)
        {
            return await _ticketsCollection.Find(t => t.TicketNumber == ticketNumber).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Ticket>> GetByBookingIdAsync(int bookingId)
        {
            return await _ticketsCollection.Find(t => t.BookingId == bookingId).ToListAsync();
        }

        public async Task<IEnumerable<Ticket>> GetByEventIdAsync(int eventId)
        {
            return await _ticketsCollection.Find(t => t.EventId == eventId).ToListAsync();
        }

        public async Task<IEnumerable<Ticket>> GetByUserIdAsync(int userId)
        {
            return await _ticketsCollection.Find(t => t.UserId == userId).ToListAsync();
        }

        public async Task<Ticket> CreateAsync(Ticket ticket)
        {
            ticket.Id = await GetNextId();
            ticket.CreatedAt = DateTime.UtcNow;
            await _ticketsCollection.InsertOneAsync(ticket);
            return ticket;
        }

        public async Task<bool> UpdateAsync(Ticket ticket)
        {
            ticket.UpdatedAt = DateTime.UtcNow;
            var result = await _ticketsCollection.ReplaceOneAsync(t => t.Id == ticket.Id, ticket);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> ValidateTicketAsync(int ticketId, int eventId)
        {
            var ticket = await GetByIdAsync(ticketId);
            if (ticket == null || ticket.EventId != eventId || ticket.Status != "Valid")
                return false;

            ticket.Status = "Used";
            ticket.UsedAt = DateTime.UtcNow;
            return await UpdateAsync(ticket);
        }
    }
}
