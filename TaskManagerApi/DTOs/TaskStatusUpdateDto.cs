using System.ComponentModel.DataAnnotations;

public class TaskStatusUpdateDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
