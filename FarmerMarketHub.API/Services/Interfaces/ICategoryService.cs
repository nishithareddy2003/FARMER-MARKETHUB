using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;

namespace FarmerMarketHub.API.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryDTO> CreateCategoryAsync(CreateCategoryDTO createCategoryDto);
        Task<CategoryDTO> UpdateCategoryAsync(string id, UpdateCategoryDTO updateCategoryDto);
        Task<bool> DeleteCategoryAsync(string id);
        Task<CategoryDTO> GetCategoryByIdAsync(string id);
        Task<CategoryDTO> GetCategoryByNameAsync(string name);
        Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();
        Task<IEnumerable<CategoryDTO>> GetCategoriesWithProductCountAsync();
    }
} 