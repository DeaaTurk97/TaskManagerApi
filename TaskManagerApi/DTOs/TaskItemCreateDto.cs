using System.ComponentModel.DataAnnotations;

namespace TaskManagerApi.DTOs
{
    public class TaskItemCreateDto
    {
        [Required]
        [MinLength(3)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public int? AssignedToUserId { get; set; }
    }
}