using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.Models;

namespace FarmerMarketHub.API.Repositories.Interfaces
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        Task<Category> GetByNameAsync(string name);
        Task<IEnumerable<Category>> GetCategoriesWithProductCountAsync();
        Task<bool> IsCategoryNameUniqueAsync(string name);
    }
} 