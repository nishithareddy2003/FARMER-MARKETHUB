using System;
using System.Collections.Generic;

namespace FarmerMarketHub.API.Models
{
    public class Cart
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public List<CartItem> Items { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CartItem
    {
        public string Id { get; set; }
        public string CartId { get; set; }
        public Cart Cart { get; set; }
        public string ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 