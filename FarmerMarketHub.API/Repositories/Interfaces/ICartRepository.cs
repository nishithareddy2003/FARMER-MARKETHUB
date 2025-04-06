using System.Threading.Tasks;
using FarmerMarketHub.API.Models;

namespace FarmerMarketHub.API.Repositories.Interfaces
{
    public interface ICartRepository : IBaseRepository<Cart>
    {
        Task<Cart> GetByUserIdAsync(string userId);
        Task<CartItem> GetCartItemAsync(string cartId, string productId);
        Task<Cart> GetCartWithItemsAsync(string userId);
        Task<Cart> GetCartByUserIdAsync(string userId);
        Task<Cart> GetByIdWithItemsAsync(string id);
        Task<bool> UpdateCartItemAsync(CartItem cartItem);
        Task<bool> RemoveCartItemAsync(string cartId, string itemId);
    }
} 