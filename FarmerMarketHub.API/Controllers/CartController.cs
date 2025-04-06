using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Services.Interfaces;

namespace FarmerMarketHub.API.Controllers
{
    [Authorize]
    public class CartController : BaseController
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = GetUserId();
                var cart = await _cartService.GetCartAsync(userId);
                if (cart == null)
                {
                    return NotFound<CartDTO>("Cart not found");
                }

                return Success(cart);
            }
            catch (Exception ex)
            {
                return Error<CartDTO>(ex.Message);
            }
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDTO addToCartDto)
        {
            try
            {
                var userId = GetUserId();
                var cart = await _cartService.AddToCartAsync(userId, addToCartDto);
                return Success(cart, "Item added to cart successfully");
            }
            catch (Exception ex)
            {
                return Error<CartDTO>(ex.Message);
            }
        }

        [HttpPut("items/{productId}")]
        public async Task<IActionResult> UpdateCartItem(string productId, [FromBody] int quantity)
        {
            try
            {
                var userId = GetUserId();
                var cart = await _cartService.UpdateCartItemAsync(userId, productId, quantity);
                return Success(cart, "Cart item updated successfully");
            }
            catch (Exception ex)
            {
                return Error<CartDTO>(ex.Message);
            }
        }

        [HttpDelete("items/{productId}")]
        public async Task<IActionResult> RemoveFromCart(string productId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _cartService.RemoveFromCartAsync(userId, productId);
                if (result == null)
                {
                    return NotFound<bool>("Cart item not found");
                }

                return Success(true, "Item removed from cart successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                var userId = GetUserId();
                var result = await _cartService.ClearCartAsync(userId);
                if (!result)
                {
                    return NotFound<bool>("Cart not found");
                }

                return Success(true, "Cart cleared successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }
    }
} 