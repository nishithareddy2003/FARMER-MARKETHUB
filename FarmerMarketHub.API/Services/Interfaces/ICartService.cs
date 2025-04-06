using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;

namespace FarmerMarketHub.API.Services.Interfaces
{
    public interface ICartService
    {
        Task<CartDTO> GetCartAsync(string userId);
        Task<CartDTO> AddToCartAsync(string userId, AddToCartDTO addToCartDto);
        Task<CartDTO> UpdateCartItemAsync(string userId, string productId, int quantity);
        Task<CartDTO> RemoveFromCartAsync(string userId, string productId);
        Task<bool> ClearCartAsync(string userId);
    }
} 