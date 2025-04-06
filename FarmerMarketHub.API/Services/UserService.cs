using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Models;
using FarmerMarketHub.API.Repositories.Interfaces;
using FarmerMarketHub.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmerMarketHub.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserDTO> GetUserByIdAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return MapToUserDTO(user);
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(MapToUserDTO);
        }

        public async Task<UserDTO> UpdateUserAsync(string id, UpdateUserDTO updateUserDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.Email = updateUserDto.Email;
            user.Phone = updateUserDto.PhoneNumber;
            user.Address = updateUserDto.Address;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
            return MapToUserDTO(user);
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            return await _userRepository.DeleteAsync(id);
        }

        public async Task<UserDTO> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            return MapToUserDTO(user);
        }

        public async Task<IEnumerable<UserDTO>> GetAllFarmersAsync()
        {
            var farmers = await _userRepository.GetAllAsync();
            return farmers.Where(u => u.Role == "farmer").Select(MapToUserDTO);
        }

        public async Task<bool> UpdateUserStatusAsync(string userId, string status)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.Status = status;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
            return true;
        }

        private UserDTO MapToUserDTO(User user)
        {
            if (user == null)
                return null;

            return new UserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone,
                Address = user.Address,
                AvatarUrl = user.AvatarUrl,
                Status = user.Status,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
} 