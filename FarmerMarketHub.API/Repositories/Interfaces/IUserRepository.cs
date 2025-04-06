using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.Models;

namespace FarmerMarketHub.API.Repositories.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<IEnumerable<User>> GetAllFarmersAsync();
        Task<User> GetByEmailAsync(string email);
        Task<bool> IsEmailUniqueAsync(string email);
        Task<User> GetByEmailAndPasswordAsync(string email, string password);
    }
} 