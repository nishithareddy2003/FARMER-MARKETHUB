using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.Models;

namespace FarmerMarketHub.API.Repositories.Interfaces
{
    public interface IOrderRepository : IBaseRepository<Order>
    {
        Task<IEnumerable<Order>> GetByUserIdAsync(string userId);
        Task<Order> GetOrderWithItemsAsync(string orderId);
        Task<IEnumerable<Order>> GetOrdersByStatusAsync(string status);
        Task<IEnumerable<OrderItem>> GetOrderItemsByProductIdAsync(string productId);
    }
} 