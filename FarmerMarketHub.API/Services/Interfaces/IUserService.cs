using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.Models;
using FarmerMarketHub.API.DTOs;

namespace FarmerMarketHub.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDTO> GetUserByIdAsync(string id);
        Task<IEnumerable<UserDTO>> GetAllUsersAsync();
        Task<UserDTO> UpdateUserAsync(string id, UpdateUserDTO userDto);
        Task<bool> DeleteUserAsync(string id);
        Task<UserDTO> GetUserByEmailAsync(string email);
        Task<IEnumerable<UserDTO>> GetAllFarmersAsync();
        Task<bool> UpdateUserStatusAsync(string userId, string status);
    }
} 