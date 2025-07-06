using System.ComponentModel.DataAnnotations;
using TaskManagerApi.Models.Enums;

namespace TaskManagerApi.DTOs
{
    public class TaskItemUpdateDto
    {

        [MinLength(3)]
        public string? Title { get; set; }

        public string? Description { get; set; } 


        public Task_Status? Status { get; set; } 


        public int? AssignedToUserId { get; set; }

        public double EstimatedTimeHours { get; set; }
    }
}