using TaskManagerApi.DTOs;
using TaskManagerApi.Models;
using TaskManagerApi.Models.Enums;
using TaskManagerApi.Repositories;
using BCrypt.Net;

namespace TaskManagerApi.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserDto?> Authenticate(UserLoginDto loginDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(loginDto.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return null; 
            }

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<UserDto?> CreateUserAsync(UserCreateDto userDto, UserRole requestingUserRole)
        {
            if (userDto.Role == UserRole.Admin && requestingUserRole != UserRole.Admin)
            {
                return null;
            }

            if (requestingUserRole != UserRole.Admin)
            {
                userDto.Role = UserRole.User; 
            }

            var existingUser = await _userRepository.GetUserByUsernameAsync(userDto.Username);
            if (existingUser != null)
            {
                return null;
            }

            var newUser = new User
            {
                Username = userDto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                Role = userDto.Role
            };

            await _userRepository.AddAsync(newUser);
            await _userRepository.SaveChangesAsync();

            return new UserDto
            {
                Id = newUser.Id,
                Username = newUser.Username,
                Role = newUser.Role
            };
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Role = u.Role
            });
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role
            };
        }
        public async Task<User?> GetUserByIdInternalAsync(int? id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<UserDto?> UpdateUserAsync(int id, UserUpdateDto userDto, UserRole requestingUserRole, int requestingUserId)
        {
            var userToUpdate = await _userRepository.GetByIdAsync(id);
            if (userToUpdate == null) return null;

            bool isUpdatingSelf = (id == requestingUserId);
            bool isAdmin = (requestingUserRole == UserRole.Admin);

            if (!isAdmin && !isUpdatingSelf)
            {
                return null; 
            }

            if (!isAdmin && userDto.Role != userToUpdate.Role)
            {
                userDto.Role = userToUpdate.Role; 
            }
            if (isAdmin && userDto.Role != userToUpdate.Role)
            {
                userToUpdate.Role = userDto.Role;
            }

            if (!string.IsNullOrEmpty(userDto.Username) && userDto.Username != userToUpdate.Username)
            {
                var existingUserWithNewUsername = await _userRepository.GetUserByUsernameAsync(userDto.Username);
                if (existingUserWithNewUsername != null && existingUserWithNewUsername.Id != userToUpdate.Id)
                {
                    return null; 
                }
                userToUpdate.Username = userDto.Username;
            }

            if (!string.IsNullOrEmpty(userDto.NewPassword))
            {
                userToUpdate.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.NewPassword);
            }

            _userRepository.UpdateAsync(userToUpdate); 
            await _userRepository.SaveChangesAsync();

            return new UserDto
            {
                Id = userToUpdate.Id,
                Username = userToUpdate.Username,
                Role = userToUpdate.Role
            };
        }

        public async Task<bool> DeleteUserAsync(int id, UserRole requestingUserRole, int requestingUserId)
        {
            var userToDelete = await _userRepository.GetByIdAsync(id);
            if (userToDelete == null) return false;

            if (requestingUserRole != UserRole.Admin || id == requestingUserId)
            {
                return false; 
            }

            await _userRepository.DeleteAsync(userToDelete);
            await _userRepository.SaveChangesAsync();
            return true;
        }
    }
}