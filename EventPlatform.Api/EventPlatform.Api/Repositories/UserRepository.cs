using MongoDB.Driver;
using MongoDB.Bson;
using EventPlatform.Api.Models;
using EventPlatform.Api.Models.Dtos;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace EventPlatform.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserRepository(IMongoDatabase database)
        {
            _usersCollection = database.GetCollection<User>("Users");
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email.ToLower().Trim());
            return await _usersCollection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
                return null;
                
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            return await _usersCollection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User> GetByUserIdAsync(int userId)
        {
            var filter = Builders<User>.Filter.Eq(u => u.UserId, userId);
            return await _usersCollection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User> CreateAsync(User user)
        {
            await _usersCollection.InsertOneAsync(user);
            return user;
        }

        public async Task<bool> UpdateUserAsync(string id, UserUpdateDto userUpdateDto)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            var update = Builders<User>.Update
                .Set(u => u.Name, userUpdateDto.Name?.Trim())
                .Set(u => u.Phone, userUpdateDto.Phone?.Trim())
                .Set(u => u.Gender, userUpdateDto.Gender)
                .Set(u => u.DateOfBirth, userUpdateDto.DateOfBirth)
                .Set(u => u.Address, userUpdateDto.Address?.Trim())
                .Set(u => u.City, userUpdateDto.City?.Trim())
                .Set(u => u.UpdatedAt, DateTime.UtcNow);

            var result = await _usersCollection.UpdateOneAsync(filter, update);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            var result = await _usersCollection.DeleteOneAsync(filter);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public async Task<bool> UserExists(int userId)
        {
            var filter = Builders<User>.Filter.Eq(u => u.UserId, userId);
            var count = await _usersCollection.CountDocumentsAsync(filter);
            return count > 0;
        }

        public async Task<bool> EmailExists(string email, string excludeUserId = null)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email.ToLower().Trim());
            
            if (!string.IsNullOrEmpty(excludeUserId))
            {
                filter = Builders<User>.Filter.And(
                    filter,
                    Builders<User>.Filter.Ne(u => u.Id, excludeUserId)
                );
            }
            
            return await _usersCollection.Find(filter).AnyAsync();
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _usersCollection.Find(_ => true).ToListAsync();
        }

        public async Task<bool> UpdateAsync(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            user.UpdatedAt = DateTime.UtcNow;
            var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
            var result = await _usersCollection.ReplaceOneAsync(filter, user);
            
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteByUserIdAsync(int userId)
        {
            var filter = Builders<User>.Filter.Eq(u => u.UserId, userId);
            var result = await _usersCollection.DeleteOneAsync(filter);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}
