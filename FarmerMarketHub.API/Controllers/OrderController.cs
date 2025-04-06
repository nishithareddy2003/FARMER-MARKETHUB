using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Services.Interfaces;

namespace FarmerMarketHub.API.Controllers
{
    [Authorize]
    public class OrderController : BaseController
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO createOrderDto)
        {
            try
            {
                var userId = GetUserId();
                var order = await _orderService.CreateOrderAsync(userId, createOrderDto);
                return Success(order, "Order created successfully");
            }
            catch (Exception ex)
            {
                return Error<OrderDTO>(ex.Message);
            }
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(string orderId)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(orderId);
                if (order == null)
                {
                    return NotFound<OrderDTO>("Order not found");
                }

                return Success(order);
            }
            catch (Exception ex)
            {
                return Error<OrderDTO>(ex.Message);
            }
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserOrders()
        {
            try
            {
                var userId = GetUserId();
                var orders = await _orderService.GetOrdersByUserIdAsync(userId);
                return Success(orders);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN,FARMER")]
        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetOrdersByStatus(string status)
        {
            try
            {
                var orders = await _orderService.GetOrdersByStatusAsync(status);
                return Success(orders);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN,FARMER")]
        [HttpPatch("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(string orderId, [FromBody] string status)
        {
            try
            {
                var result = await _orderService.UpdateOrderStatusAsync(orderId, status);
                if (!result)
                {
                    return NotFound<bool>("Order not found");
                }

                return Success(true, "Order status updated successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPatch("{orderId}/payment-status")]
        public async Task<IActionResult> UpdatePaymentStatus(string orderId, [FromBody] string paymentStatus)
        {
            try
            {
                var result = await _orderService.UpdatePaymentStatusAsync(orderId, paymentStatus);
                if (!result)
                {
                    return NotFound<bool>("Order not found");
                }

                return Success(true, "Payment status updated successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }
    }
} 