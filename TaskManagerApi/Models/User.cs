using TaskManagerApi.Models.Enums;

namespace TaskManagerApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public ICollection<TaskItem>? Tasks { get; set; }
    }
}
