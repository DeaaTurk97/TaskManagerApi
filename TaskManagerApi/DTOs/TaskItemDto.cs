using TaskManagerApi.Models.Enums; 

namespace TaskManagerApi.DTOs
{
    public class TaskItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Task_Status Status { get; set; }
        public int? AssignedToUserId { get; set; }
        public string AssignedToUsername { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public double EstimatedTimeHours { get; set; }
    }
}