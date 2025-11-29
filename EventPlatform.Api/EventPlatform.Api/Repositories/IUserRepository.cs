using EventPlatform.Api.Models;
using EventPlatform.Api.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EventPlatform.Api.Repositories
{
    public interface IUserRepository
    {
        // GET operations
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetByEmailAsync(string email);
        Task<User> GetByIdAsync(string id);
        Task<User> GetByUserIdAsync(int userId);
        
        // CRUD operations
        Task<User> CreateAsync(User user);
        Task<bool> UpdateAsync(User user);
        Task<bool> UpdateUserAsync(string id, UserUpdateDto userUpdateDto);
        Task<bool> DeleteAsync(string id);
        Task<bool> DeleteByUserIdAsync(int userId);
        
        // Helper methods
        Task<bool> UserExists(int userId);
        Task<bool> EmailExists(string email, string excludeUserId = null);
    }
}
