using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FarmerMarketHub.API.DTOs;
using FarmerMarketHub.API.Services.Interfaces;

namespace FarmerMarketHub.API.Controllers
{
    public class CategoryController : BaseController
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                return Success(categories);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [HttpGet("with-products")]
        public async Task<IActionResult> GetCategoriesWithProductCount()
        {
            try
            {
                var categories = await _categoryService.GetCategoriesWithProductCountAsync();
                return Success(categories);
            }
            catch (Exception ex)
            {
                return Error<object>(ex.Message);
            }
        }

        [HttpGet("{categoryId}")]
        public async Task<IActionResult> GetCategoryById(string categoryId)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(categoryId);
                if (category == null)
                {
                    return NotFound<CategoryDTO>("Category not found");
                }

                return Success(category);
            }
            catch (Exception ex)
            {
                return Error<CategoryDTO>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDTO createCategoryDto)
        {
            try
            {
                var category = await _categoryService.CreateCategoryAsync(createCategoryDto);
                return Success(category, "Category created successfully");
            }
            catch (Exception ex)
            {
                return Error<CategoryDTO>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{categoryId}")]
        public async Task<IActionResult> UpdateCategory(string categoryId, [FromBody] UpdateCategoryDTO updateCategoryDto)
        {
            try
            {
                var category = await _categoryService.UpdateCategoryAsync(categoryId, updateCategoryDto);
                if (category == null)
                {
                    return NotFound<CategoryDTO>("Category not found");
                }

                return Success(category, "Category updated successfully");
            }
            catch (Exception ex)
            {
                return Error<CategoryDTO>(ex.Message);
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{categoryId}")]
        public async Task<IActionResult> DeleteCategory(string categoryId)
        {
            try
            {
                var result = await _categoryService.DeleteCategoryAsync(categoryId);
                if (!result)
                {
                    return NotFound<bool>("Category not found");
                }

                return Success(true, "Category deleted successfully");
            }
            catch (Exception ex)
            {
                return Error<bool>(ex.Message);
            }
        }
    }
} 