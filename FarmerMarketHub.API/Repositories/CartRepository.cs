using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FarmerMarketHub.API.Data;
using FarmerMarketHub.API.Models;
using FarmerMarketHub.API.Repositories.Interfaces;

namespace FarmerMarketHub.API.Repositories
{
    public class CartRepository : BaseRepository<Cart>, ICartRepository
    {
        public CartRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Cart> GetByUserIdAsync(string userId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<CartItem> GetCartItemAsync(string cartId, string productId)
        {
            return await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId);
        }

        public async Task<Cart> GetCartWithItemsAsync(string userId)
        {
            return await _dbSet
                .Include(c => c.Items)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<Cart> GetCartByUserIdAsync(string userId)
        {
            return await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<Cart> GetByIdWithItemsAsync(string id)
        {
            return await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> UpdateCartItemAsync(CartItem cartItem)
        {
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(i => i.Id == cartItem.Id);

            if (existingItem != null)
            {
                existingItem.Quantity = cartItem.Quantity;
                existingItem.UpdatedAt = DateTime.UtcNow;
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }

        public async Task<bool> RemoveCartItemAsync(string cartId, string itemId)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(i => i.Id == itemId && i.CartId == cartId);

            if (item != null)
            {
                _context.CartItems.Remove(item);
                return await _context.SaveChangesAsync() > 0;
            }
            return false;
        }
    }
} 