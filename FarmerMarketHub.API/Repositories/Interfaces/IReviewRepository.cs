using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.Models;

namespace FarmerMarketHub.API.Repositories.Interfaces
{
    public interface IReviewRepository : IBaseRepository<Review>
    {
        Task<IEnumerable<Review>> GetByProductIdAsync(string productId);
        Task<IEnumerable<Review>> GetByUserIdAsync(string userId);
        Task<double> GetAverageRatingForProductAsync(string productId);
        Task<bool> HasUserReviewedProductAsync(string userId, string productId);
    }
} 