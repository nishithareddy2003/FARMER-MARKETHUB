using System;
using System.Collections.Generic;

namespace FarmerMarketHub.API.DTOs
{
    public class CreateProductDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string CategoryId { get; set; } = string.Empty;
        public List<string> Images { get; set; } = new List<string>();
        public string Unit { get; set; } = string.Empty;
        public string FarmerId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class UpdateProductDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string CategoryId { get; set; } = string.Empty;
        public List<string> Images { get; set; } = new List<string>();
        public string Unit { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class ProductDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string CategoryId { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public List<string> Images { get; set; } = new List<string>();
        public string Unit { get; set; } = string.Empty;
        public string FarmerId { get; set; } = string.Empty;
        public string FarmerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
} 