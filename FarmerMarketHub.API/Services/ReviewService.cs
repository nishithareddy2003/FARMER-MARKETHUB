using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Models;
using FarmerMarketHub.API.Repositories.Interfaces;
using FarmerMarketHub.API.Services.Interfaces;

namespace FarmerMarketHub.API.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;

        public ReviewService(
            IReviewRepository reviewRepository,
            IUserRepository userRepository,
            IProductRepository productRepository)
        {
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
            _productRepository = productRepository;
        }

        public async Task<ReviewDTO> CreateReviewAsync(string userId, CreateReviewDTO createReviewDto)
        {
            if (await HasUserReviewedProductAsync(userId, createReviewDto.ProductId))
            {
                throw new Exception("User has already reviewed this product");
            }

            var product = await _productRepository.GetByIdAsync(createReviewDto.ProductId);
            if (product == null)
            {
                throw new Exception("Product not found");
            }

            var review = new Review
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                ProductId = createReviewDto.ProductId,
                Rating = createReviewDto.Rating,
                Comment = createReviewDto.Comment,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _reviewRepository.AddAsync(review);

            return await MapToReviewDTOAsync(review);
        }

        public async Task<ReviewDTO> GetReviewByIdAsync(string reviewId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null)
            {
                return null;
            }

            return await MapToReviewDTOAsync(review);
        }

        public async Task<IEnumerable<ReviewDTO>> GetReviewsByProductIdAsync(string productId)
        {
            var reviews = await _reviewRepository.GetByProductIdAsync(productId);
            var reviewDtos = new List<ReviewDTO>();

            foreach (var review in reviews)
            {
                reviewDtos.Add(await MapToReviewDTOAsync(review));
            }

            return reviewDtos;
        }

        public async Task<IEnumerable<ReviewDTO>> GetReviewsByUserIdAsync(string userId)
        {
            var reviews = await _reviewRepository.GetByUserIdAsync(userId);
            var reviewDtos = new List<ReviewDTO>();

            foreach (var review in reviews)
            {
                reviewDtos.Add(await MapToReviewDTOAsync(review));
            }

            return reviewDtos;
        }

        public async Task<double> GetAverageRatingForProductAsync(string productId)
        {
            return await _reviewRepository.GetAverageRatingForProductAsync(productId);
        }

        public async Task<bool> HasUserReviewedProductAsync(string userId, string productId)
        {
            return await _reviewRepository.HasUserReviewedProductAsync(userId, productId);
        }

        public async Task<bool> DeleteReviewAsync(string reviewId, string userId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null || review.UserId != userId)
            {
                return false;
            }

            _reviewRepository.Remove(review);
            return true;
        }

        private async Task<ReviewDTO> MapToReviewDTOAsync(Review review)
        {
            var user = await _userRepository.GetByIdAsync(review.UserId);
            var product = await _productRepository.GetByIdAsync(review.ProductId);

            return new ReviewDTO
            {
                Id = review.Id,
                UserId = review.UserId,
                UserName = $"{user.FirstName} {user.LastName}",
                ProductId = review.ProductId,
                ProductName = product.Name,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                UpdatedAt = review.UpdatedAt
            };
        }
    }
} 