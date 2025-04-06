using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Models;
using FarmerMarketHub.API.Repositories.Interfaces;
using FarmerMarketHub.API.Services.Interfaces;

namespace FarmerMarketHub.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;
        private readonly ICartService _cartService;

        public OrderService(
            IOrderRepository orderRepository,
            IProductRepository productRepository,
            IUserRepository userRepository,
            ICartService cartService)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _userRepository = userRepository;
            _cartService = cartService;
        }

        public async Task<OrderDTO> CreateOrderAsync(string userId, CreateOrderDTO createOrderDto)
        {
            var cart = await _cartService.GetCartAsync(userId);
            if (cart == null || !cart.Items.Any())
            {
                throw new Exception("Cart is empty");
            }

            var order = new Order
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Status = "PENDING",
                PaymentStatus = "PENDING",
                DeliveryAddress = createOrderDto.DeliveryAddress,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var cartItem in cart.Items)
            {
                var product = await _productRepository.GetByIdAsync(cartItem.ProductId);
                if (product == null)
                {
                    throw new Exception($"Product not found: {cartItem.ProductId}");
                }

                if (product.Stock < cartItem.Quantity)
                {
                    throw new Exception($"Insufficient stock for product: {product.Name}");
                }

                var orderItem = new OrderItem
                {
                    Id = Guid.NewGuid().ToString(),
                    OrderId = order.Id,
                    ProductId = product.Id,
                    Quantity = cartItem.Quantity,
                    UnitPrice = product.Price,
                    Subtotal = product.Price * cartItem.Quantity
                };

                orderItems.Add(orderItem);
                totalAmount += orderItem.Subtotal;

                product.Stock -= cartItem.Quantity;
                await _productRepository.UpdateAsync(product);
            }

            order.Items = orderItems;
            order.TotalAmount = totalAmount;

            await _orderRepository.AddAsync(order);
            await _cartService.ClearCartAsync(userId);

            return await MapToOrderDTOAsync(order);
        }

        public async Task<OrderDTO> GetOrderByIdAsync(string orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                throw new Exception("Order not found");
            }

            return await MapToOrderDTOAsync(order);
        }

        public async Task<IEnumerable<OrderDTO>> GetOrdersByUserIdAsync(string userId)
        {
            var orders = await _orderRepository.GetByUserIdAsync(userId);
            var orderDTOs = new List<OrderDTO>();

            foreach (var order in orders)
            {
                orderDTOs.Add(await MapToOrderDTOAsync(order));
            }

            return orderDTOs;
        }

        public async Task<IEnumerable<OrderDTO>> GetOrdersByStatusAsync(string status)
        {
            var orders = await _orderRepository.GetOrdersByStatusAsync(status);
            var orderDTOs = new List<OrderDTO>();

            foreach (var order in orders)
            {
                orderDTOs.Add(await MapToOrderDTOAsync(order));
            }

            return orderDTOs;
        }

        public async Task<bool> UpdateOrderStatusAsync(string orderId, string status)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                return false;
            }

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;

            await _orderRepository.UpdateAsync(order);
            return true;
        }

        public async Task<bool> UpdatePaymentStatusAsync(string orderId, string paymentStatus)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                return false;
            }

            order.PaymentStatus = paymentStatus;
            order.UpdatedAt = DateTime.UtcNow;

            await _orderRepository.UpdateAsync(order);
            return true;
        }

        private async Task<OrderDTO> MapToOrderDTOAsync(Order order)
        {
            var user = await _userRepository.GetByIdAsync(order.UserId);

            return new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                UserName = $"{user.FirstName} {user.LastName}",
                Items = order.Items.Select(item => new OrderItemDTO
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Subtotal = item.Subtotal
                }).ToList(),
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                DeliveryAddress = order.DeliveryAddress,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt
            };
        }
    }
} 