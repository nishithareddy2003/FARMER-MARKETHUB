using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Models;
using FarmerMarketHub.API.Repositories.Interfaces;
using FarmerMarketHub.API.Services.Interfaces;

namespace FarmerMarketHub.API.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;

        public CartService(ICartRepository cartRepository, IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }

        public async Task<CartDTO> GetCartAsync(string userId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                cart = new Cart
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    Items = new List<CartItem>(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _cartRepository.AddAsync(cart);
            }

            return await MapToCartDTOAsync(cart);
        }

        public async Task<CartDTO> AddToCartAsync(string userId, AddToCartDTO addToCartDto)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                cart = new Cart
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    Items = new List<CartItem>(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _cartRepository.AddAsync(cart);
            }

            var product = await _productRepository.GetByIdAsync(addToCartDto.ProductId);
            if (product == null)
            {
                throw new Exception("Product not found");
            }

            if (product.Stock < addToCartDto.Quantity)
            {
                throw new Exception("Insufficient stock");
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == addToCartDto.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity += addToCartDto.Quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    Id = Guid.NewGuid().ToString(),
                    CartId = cart.Id,
                    ProductId = addToCartDto.ProductId,
                    Quantity = addToCartDto.Quantity,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _cartRepository.UpdateAsync(cart);

            return await MapToCartDTOAsync(cart);
        }

        public async Task<CartDTO> UpdateCartItemAsync(string userId, string productId, int quantity)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                throw new Exception("Cart not found");
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (cartItem == null)
            {
                throw new Exception("Cart item not found");
            }

            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
            {
                throw new Exception("Product not found");
            }

            if (product.Stock < quantity)
            {
                throw new Exception("Insufficient stock");
            }

            cartItem.Quantity = quantity;
            cartItem.UpdatedAt = DateTime.UtcNow;
            cart.UpdatedAt = DateTime.UtcNow;

            await _cartRepository.UpdateAsync(cart);

            return await MapToCartDTOAsync(cart);
        }

        public async Task<CartDTO> RemoveFromCartAsync(string userId, string productId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                throw new Exception("Cart not found");
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (cartItem == null)
            {
                throw new Exception("Cart item not found");
            }

            cart.Items.Remove(cartItem);
            cart.UpdatedAt = DateTime.UtcNow;

            await _cartRepository.UpdateAsync(cart);

            return await MapToCartDTOAsync(cart);
        }

        public async Task<bool> ClearCartAsync(string userId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return false;
            }

            cart.Items.Clear();
            cart.UpdatedAt = DateTime.UtcNow;

            await _cartRepository.UpdateAsync(cart);
            return true;
        }

        private async Task<CartDTO> MapToCartDTOAsync(Cart cart)
        {
            var cartItemDTOs = new List<CartItemDTO>();

            foreach (var item in cart.Items)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                cartItemDTOs.Add(new CartItemDTO
                {
                    ProductId = item.ProductId,
                    ProductName = product.Name,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price,
                    Subtotal = item.Quantity * product.Price
                });
            }

            return new CartDTO
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = cartItemDTOs,
                TotalAmount = cartItemDTOs.Sum(i => i.Subtotal),
                CreatedAt = cart.CreatedAt,
                UpdatedAt = cart.UpdatedAt
            };
        }
    }
} 