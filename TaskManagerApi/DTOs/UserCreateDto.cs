using System.ComponentModel.DataAnnotations;
using TaskManagerApi.Models.Enums; 

namespace TaskManagerApi.DTOs
{
    public class UserCreateDto
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty; 

        
        public UserRole Role { get; set; } = UserRole.User;
    }
}