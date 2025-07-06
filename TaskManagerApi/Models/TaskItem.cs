using TaskManagerApi.Models.Enums;


namespace TaskManagerApi.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Task_Status Status { get; set; }

        public int? AssignedToUserId { get; set; }
        public User? AssignedToUser { get; set; }
    }
}
