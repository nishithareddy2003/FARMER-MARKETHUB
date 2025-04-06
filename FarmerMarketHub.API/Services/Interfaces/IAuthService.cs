using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;

namespace FarmerMarketHub.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserDTO> RegisterAsync(RegisterDTO registerDto);
        Task<LoginResponseDTO> LoginAsync(LoginDTO loginDto);
        Task<bool> ChangePasswordAsync(string userId, ChangePasswordDTO changePasswordDto);
    }
} 