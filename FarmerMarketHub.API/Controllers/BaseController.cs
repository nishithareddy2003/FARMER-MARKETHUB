using Microsoft.AspNetCore.Mvc;
using FarmerMarketHub.API.DTOs;

namespace FarmerMarketHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseController : ControllerBase
    {
        protected IActionResult Success<T>(T data, string message = "Operation completed successfully")
        {
            return Ok(ApiResponse<T>.SuccessResponse(data, message));
        }

        protected IActionResult Error<T>(string error, string message = "Operation failed")
        {
            return BadRequest(ApiResponse<T>.ErrorResponse(error, message));
        }

        protected IActionResult NotFound<T>(string message = "Resource not found")
        {
            return NotFound(ApiResponse<T>.ErrorResponse("Not Found", message));
        }

        protected string GetUserId()
        {
            return User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        }

        protected string GetUserRole()
        {
            return User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        }
    }
} 