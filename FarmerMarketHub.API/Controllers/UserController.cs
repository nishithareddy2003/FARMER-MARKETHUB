using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Services.Interfaces;

namespace FarmerMarketHub.API.Controllers
{
    [Authorize]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            try
            {
                var userId = GetUserId();
                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound<UserDTO>("User not found");
                }

                return Success(user);
            }
            catch (Exception ex)
            {
                return Error<UserDTO>(ex.Message);
            }
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserDTO updateUserDto)
        {
            try
            {
                var userId = GetUserId();
                var user = await _userService.UpdateUserAsync(userId, updateUserDto);
                if (user == null)
                {
                    return NotFound<UserDTO>("User not found");
                }

                return Success(user, "Profile updated successfully");
            }
            catch (Exception ex)
            {
                return Error<UserDTO>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Success(users);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("farmers")]
        public async Task<IActionResult> GetAllFarmers()
        {
            try
            {
                var farmers = await _userService.GetAllFarmersAsync();
                return Success(farmers);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPatch("{userId}/status")]
        public async Task<IActionResult> UpdateUserStatus(string userId, [FromBody] string status)
        {
            try
            {
                var result = await _userService.UpdateUserStatusAsync(userId, status);
                if (!result)
                {
                    return NotFound<bool>("User not found");
                }

                return Success(true, "User status updated successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var result = await _userService.DeleteUserAsync(userId);
                if (!result)
                {
                    return NotFound<bool>("User not found");
                }

                return Success(true, "User deleted successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }
    }
} 