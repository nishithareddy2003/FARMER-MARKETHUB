using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FarmerMarketHub.API.Data;
using FarmerMarketHub.API.Models;
using FarmerMarketHub.API.Repositories.Interfaces;

namespace FarmerMarketHub.API.Repositories
{
    public class ReviewRepository : BaseRepository<Review>, IReviewRepository
    {
        public ReviewRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Review>> GetByProductIdAsync(string productId)
        {
            return await _dbSet
                .Include(r => r.User)
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Review>> GetByUserIdAsync(string userId)
        {
            return await _dbSet
                .Include(r => r.Product)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<double> GetAverageRatingForProductAsync(string productId)
        {
            var reviews = await _dbSet
                .Where(r => r.ProductId == productId)
                .ToListAsync();

            if (!reviews.Any())
                return 0;

            return reviews.Average(r => r.Rating);
        }

        public async Task<bool> HasUserReviewedProductAsync(string userId, string productId)
        {
            return await _dbSet
                .AnyAsync(r => r.UserId == userId && r.ProductId == productId);
        }
    }
} 