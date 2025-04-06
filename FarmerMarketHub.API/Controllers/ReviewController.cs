using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Services.Interfaces;

namespace FarmerMarketHub.API.Controllers
{
    [Authorize]
    public class ReviewController : BaseController
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDTO createReviewDto)
        {
            try
            {
                var userId = GetUserId();
                var review = await _reviewService.CreateReviewAsync(userId, createReviewDto);
                return Success(review, "Review created successfully");
            }
            catch (Exception ex)
            {
                return Error<ReviewDTO>(ex.Message);
            }
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetProductReviews(string productId)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsByProductIdAsync(productId);
                return Success(reviews);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserReviews()
        {
            try
            {
                var userId = GetUserId();
                var reviews = await _reviewService.GetReviewsByUserIdAsync(userId);
                return Success(reviews);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteReview(string reviewId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _reviewService.DeleteReviewAsync(reviewId, userId);
                if (!result)
                {
                    return NotFound<bool>("Review not found");
                }

                return Success(true, "Review deleted successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }
    }
} 