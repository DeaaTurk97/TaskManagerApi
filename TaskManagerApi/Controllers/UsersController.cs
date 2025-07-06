using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.DTOs;
using TaskManagerApi.Services;
using TaskManagerApi.Models.Enums;
using TaskManagerApi.Extensions;

namespace TaskManagerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

       
        [HttpPost]
        [AllowAnonymous] 
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto userDto)
        {
            
            UserRole requestingUserRole = UserRole.User;
            if (User.Identity?.IsAuthenticated == true)
            {
                requestingUserRole = User.GetUserRole();
            }

            var newUser = await _userService.CreateUserAsync(userDto, requestingUserRole);
            if (newUser == null)
            {
               
                return BadRequest(new { message = "Could not create user. Username might be taken or role assignment is unauthorized." });
            }
            return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, newUser);
        }

       
        [HttpGet("{id}")]
        [Authorize(Roles = nameof(UserRole.Admin) + "," + nameof(UserRole.User))] 
        public async Task<IActionResult> GetUserById(int id)
        {
            var requestingUserRole = User.GetUserRole();
            var requestingUserId = User.GetUserId();

           
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

           
            if (requestingUserRole != UserRole.Admin && id != requestingUserId)
            {
                return Forbid(); 
            }

            return Ok(user);
        }

       
        [HttpGet]
        [Authorize(Roles = nameof(UserRole.Admin))] 
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

       
        [HttpPut("{id}")]
        [Authorize(Roles = nameof(UserRole.Admin) + "," + nameof(UserRole.User))]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userDto)
        {
            var requestingUserRole = User.GetUserRole();
            var requestingUserId = User.GetUserId();

          
            var updatedUser = await _userService.UpdateUserAsync(id, userDto, requestingUserRole, requestingUserId);
            if (updatedUser == null)
            {
                
                return BadRequest(new { message = "Could not update user. User not found, not authorized, or data invalid." });
            }
            return Ok(updatedUser);
        }

        
        [HttpDelete("{id}")]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var requestingUserRole = User.GetUserRole();
            var requestingUserId = User.GetUserId(); 

            var result = await _userService.DeleteUserAsync(id, requestingUserRole, requestingUserId);
            if (!result)
            {
                
                return NotFound(new { message = "User not found or you are not authorized to delete this user." });
            }
            return NoContent(); 
        }
    }
}