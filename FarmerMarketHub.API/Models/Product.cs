using System;
using System.Collections.Generic;

namespace FarmerMarketHub.API.Models
{
    public class Product
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Images { get; set; }
        public int Stock { get; set; }
        public string FarmerId { get; set; }
        public User Farmer { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 