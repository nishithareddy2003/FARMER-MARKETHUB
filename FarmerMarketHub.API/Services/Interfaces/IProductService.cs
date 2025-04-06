using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;

namespace FarmerMarketHub.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<ProductDTO> CreateProductAsync(CreateProductDTO createProductDto, string farmerId);
        Task<ProductDTO> UpdateProductAsync(string id, UpdateProductDTO updateProductDto);
        Task<bool> DeleteProductAsync(string id);
        Task<ProductDTO> GetProductByIdAsync(string id);
        Task<IEnumerable<ProductDTO>> GetAllProductsAsync();
        Task<IEnumerable<ProductDTO>> GetProductsByFarmerIdAsync(string farmerId);
        Task<IEnumerable<ProductDTO>> GetProductsByCategoryAsync(string category);
        Task<IEnumerable<ProductDTO>> SearchProductsAsync(string searchTerm);
        Task<IEnumerable<ProductDTO>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice);
        Task<bool> UpdateProductStatusAsync(string id, string status);
    }
} 