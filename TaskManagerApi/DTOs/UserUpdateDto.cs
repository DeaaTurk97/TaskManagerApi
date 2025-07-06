using System.ComponentModel.DataAnnotations;
using TaskManagerApi.Models.Enums; 

namespace TaskManagerApi.DTOs
{
    public class UserUpdateDto
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; } = string.Empty;


        [MinLength(6)]
        public string? NewPassword { get; set; } 

        public UserRole Role { get; set; }
    }
}