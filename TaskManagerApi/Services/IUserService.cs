using TaskManagerApi.DTOs;
using TaskManagerApi.Models; 
using TaskManagerApi.Models.Enums; 

namespace TaskManagerApi.Services
{
    public interface IUserService
    {
        Task<UserDto?> Authenticate(UserLoginDto loginDto);
        Task<UserDto?> CreateUserAsync(UserCreateDto userDto, UserRole requestingUserRole);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int id);
        Task<UserDto?> UpdateUserAsync(int id, UserUpdateDto userDto, UserRole requestingUserRole, int requestingUserId);
        Task<bool> DeleteUserAsync(int id, UserRole requestingUserRole, int requestingUserId);
        Task<User?> GetUserByIdInternalAsync(int? id);
    }
}