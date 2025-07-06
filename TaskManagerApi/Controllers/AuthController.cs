using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.DTOs;
using TaskManagerApi.Services;

namespace TaskManagerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthController(IUserService userService, IJwtTokenService jwtTokenService)
        {
            _userService = userService;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            var userDto = await _userService.Authenticate(loginDto);

            if (userDto == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            
            var user = await _userService.GetUserByIdInternalAsync(userDto.Id); 
            if (user == null)
            {
                return StatusCode(500, "User data inconsistency."); 
            }

            var token = _jwtTokenService.GenerateToken(user);

            return Ok(new { token, user = userDto }); 
        }
    }
}