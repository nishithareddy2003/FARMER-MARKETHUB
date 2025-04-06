using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Services.Interfaces;

namespace FarmerMarketHub.API.Controllers
{
    public class ProductController : BaseController
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Success(products);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(string id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null)
                {
                    return NotFound<ProductDTO>("Product not found");
                }

                return Success(product);
            }
            catch (Exception ex)
            {
                return Error<ProductDTO>(ex.Message);
            }
        }

        [Authorize(Roles = "FARMER")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDTO createProductDto)
        {
            try
            {
                var farmerId = GetUserId();
                var product = await _productService.CreateProductAsync(createProductDto, farmerId);
                return Success(product, "Product created successfully");
            }
            catch (Exception ex)
            {
                return Error<ProductDTO>(ex.Message);
            }
        }

        [Authorize(Roles = "FARMER")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(string id, [FromBody] UpdateProductDTO updateProductDto)
        {
            try
            {
                var product = await _productService.UpdateProductAsync(id, updateProductDto);
                return Success(product, "Product updated successfully");
            }
            catch (Exception ex)
            {
                return Error<ProductDTO>(ex.Message);
            }
        }

        [Authorize(Roles = "FARMER")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            try
            {
                var result = await _productService.DeleteProductAsync(id);
                if (!result)
                {
                    return NotFound<bool>("Product not found");
                }

                return Success(true, "Product deleted successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }

        [HttpGet("farmer/{farmerId}")]
        public async Task<IActionResult> GetProductsByFarmerId(string farmerId)
        {
            try
            {
                var products = await _productService.GetProductsByFarmerIdAsync(farmerId);
                return Success(products);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetProductsByCategory(string category)
        {
            try
            {
                var products = await _productService.GetProductsByCategoryAsync(category);
                return Success(products);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts([FromQuery] string searchTerm)
        {
            try
            {
                var products = await _productService.SearchProductsAsync(searchTerm);
                return Success(products);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [HttpGet("price-range")]
        public async Task<IActionResult> GetProductsByPriceRange([FromQuery] decimal minPrice, [FromQuery] decimal maxPrice)
        {
            try
            {
                var products = await _productService.GetProductsByPriceRangeAsync(minPrice, maxPrice);
                return Success(products);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [Authorize(Roles = "FARMER")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateProductStatus(string id, [FromBody] string status)
        {
            try
            {
                var result = await _productService.UpdateProductStatusAsync(id, status);
                if (!result)
                {
                    return NotFound<bool>("Product not found");
                }

                return Success(true, "Product status updated successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }
    }
} 