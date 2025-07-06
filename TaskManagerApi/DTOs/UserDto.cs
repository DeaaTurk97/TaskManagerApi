using TaskManagerApi.Models.Enums; 

namespace TaskManagerApi.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public UserRole Role { get; set; }
    }
}