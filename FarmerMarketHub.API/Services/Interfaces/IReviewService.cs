using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;

namespace FarmerMarketHub.API.Services.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDTO> CreateReviewAsync(string userId, CreateReviewDTO createReviewDto);
        Task<ReviewDTO> GetReviewByIdAsync(string reviewId);
        Task<IEnumerable<ReviewDTO>> GetReviewsByProductIdAsync(string productId);
        Task<IEnumerable<ReviewDTO>> GetReviewsByUserIdAsync(string userId);
        Task<double> GetAverageRatingForProductAsync(string productId);
        Task<bool> HasUserReviewedProductAsync(string userId, string productId);
        Task<bool> DeleteReviewAsync(string reviewId, string userId);
    }
} 