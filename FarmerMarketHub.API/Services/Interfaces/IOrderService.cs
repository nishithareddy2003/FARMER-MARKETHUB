using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;

namespace FarmerMarketHub.API.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDTO> CreateOrderAsync(string userId, CreateOrderDTO createOrderDto);
        Task<OrderDTO> GetOrderByIdAsync(string orderId);
        Task<IEnumerable<OrderDTO>> GetOrdersByUserIdAsync(string userId);
        Task<IEnumerable<OrderDTO>> GetOrdersByStatusAsync(string status);
        Task<bool> UpdateOrderStatusAsync(string orderId, string status);
        Task<bool> UpdatePaymentStatusAsync(string orderId, string paymentStatus);
    }
} 