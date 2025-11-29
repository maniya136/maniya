using EventPlatform.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly IMongoCollection<Booking> _bookingsCollection;
        private readonly IMongoCollection<Counter> _countersCollection;
        private const string CounterId = "booking";

        public BookingRepository(IMongoDatabase database, IOptions<DatabaseSettings> dbSettings)
        {
            _bookingsCollection = database.GetCollection<Booking>("Bookings");
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

        public async Task<Booking> GetByIdAsync(int id)
        {
            return await _bookingsCollection.Find(b => b.Id == id).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(int userId)
        {
            return await _bookingsCollection.Find(b => b.UserId == userId)
                .SortByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetByEventIdAsync(int eventId)
        {
            return await _bookingsCollection.Find(b => b.EventId == eventId)
                .SortByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Booking> CreateAsync(Booking booking)
        {
            booking.Id = await GetNextId();
            booking.CreatedAt = System.DateTime.UtcNow;
            await _bookingsCollection.InsertOneAsync(booking);
            return booking;
        }

        public async Task<bool> UpdateAsync(Booking booking)
        {
            booking.UpdatedAt = System.DateTime.UtcNow;
            var result = await _bookingsCollection.ReplaceOneAsync(b => b.Id == booking.Id, booking);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var result = await _bookingsCollection.DeleteOneAsync(b => b.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
