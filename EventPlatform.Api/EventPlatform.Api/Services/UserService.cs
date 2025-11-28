using EventPlatform.Api.Models;
using EventPlatform.Api.Models.Dtos;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EventPlatform.Api.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<BsonDocument> _countersCollection;

        public UserService(IOptions<DatabaseSettings> dbSettings)
        {
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _usersCollection = database.GetCollection<User>("users");
            _countersCollection = database.GetCollection<BsonDocument>("counters");

            // Create indexes if they don't exist
            CreateIndexes();
        }

        private void CreateIndexes()
        {
            // Unique index for UserId
            var userIdIndex = new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.UserId),
                new CreateIndexOptions { Unique = true }
            );
            _usersCollection.Indexes.CreateOne(userIdIndex);

            // Unique index for Email
            var emailIndex = new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.Email),
                new CreateIndexOptions { Unique = true }
            );
            _usersCollection.Indexes.CreateOne(emailIndex);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User> CreateAsync(User user)
        {
            // Increment sequence for UserId
            var filter = Builders<BsonDocument>.Filter.Eq("_id", "userId");
            var update = Builders<BsonDocument>.Update.Inc("seq", 1);
            var options = new FindOneAndUpdateOptions<BsonDocument>
            {
                IsUpsert = true,
                ReturnDocument = ReturnDocument.After
            };

            var counter = await _countersCollection.FindOneAndUpdateAsync(filter, update, options);
            user.UserId = counter["seq"].AsInt32;
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            await _usersCollection.InsertOneAsync(user);
            return user;
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            if (ObjectId.TryParse(id, out _))
            {
                return await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
            }
            return null;
        }

        public async Task<User?> GetByUserIdAsync(int userId)
        {
            return await _usersCollection.Find(u => u.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task<User?> GetCurrentUserAsync(string userId)
        {
            if (ObjectId.TryParse(userId, out _))
            {
                return await _usersCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
            }
            return null;
        }

        public async Task<List<EventType>> GetUserEventsAsync(int userId)
        {
            // Placeholder implementation
            return new List<EventType>();
        }

        public async Task<bool> UpdateUserAsync(string id, UserUpdateDto userUpdateDto)
        {
            var update = Builders<User>.Update
                .Set(u => u.Name, userUpdateDto.Name)
                .Set(u => u.Phone, userUpdateDto.Phone)
                .Set(u => u.Gender, userUpdateDto.Gender)
                .Set(u => u.DateOfBirth, userUpdateDto.DateOfBirth)
                .Set(u => u.Address, userUpdateDto.Address)
                .Set(u => u.City, userUpdateDto.City)
                .Set(u => u.UpdatedAt, DateTime.UtcNow);

            var result = await _usersCollection.UpdateOneAsync(u => u.Id == id, update);

            return result.ModifiedCount > 0;
        }
    }
}
