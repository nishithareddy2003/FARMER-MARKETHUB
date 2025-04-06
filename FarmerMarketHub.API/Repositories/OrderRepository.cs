using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FarmerMarketHub.API.Data;
using FarmerMarketHub.API.Models;
using FarmerMarketHub.API.Repositories.Interfaces;

namespace FarmerMarketHub.API.Repositories
{
    public class OrderRepository : BaseRepository<Order>, IOrderRepository
    {
        public OrderRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Order>> GetByUserIdAsync(string userId)
        {
            return await _dbSet
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order> GetOrderWithItemsAsync(string orderId)
        {
            return await _dbSet
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(string status)
        {
            return await _dbSet
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .Where(o => o.Status == status)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<OrderItem>> GetOrderItemsByProductIdAsync(string productId)
        {
            return await _context.OrderItems
                .Include(oi => oi.Order)
                    .ThenInclude(o => o.User)
                .Where(oi => oi.ProductId == productId)
                .OrderByDescending(oi => oi.Order.CreatedAt)
                .ToListAsync();
        }
    }
} 