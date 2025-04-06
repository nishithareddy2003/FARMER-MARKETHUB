using System;
using System.Collections.Generic;

namespace FarmerMarketHub.API.DTOs
{
    public class CartItemDTO
    {
        public string Id { get; set; } = string.Empty;
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CartDTO
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public List<CartItemDTO> Items { get; set; } = new List<CartItemDTO>();
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class AddToCartDTO
    {
        public string ProductId { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }

    public class CreateOrderDTO
    {
        public string DeliveryAddress { get; set; } = string.Empty;
        public List<CartItemDTO> Items { get; set; } = new List<CartItemDTO>();
    }

    public class OrderDTO
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public List<OrderItemDTO> Items { get; set; } = new List<OrderItemDTO>();
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class OrderItemDTO
    {
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class UpdateOrderStatusDTO
    {
        public string Status { get; set; } = string.Empty;
    }

    public class UpdatePaymentStatusDTO
    {
        public string PaymentStatus { get; set; } = string.Empty;
    }
} 