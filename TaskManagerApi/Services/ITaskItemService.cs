using TaskManagerApi.DTOs;
using TaskManagerApi.Models.Enums;

namespace TaskManagerApi.Services
{
    public interface ITaskItemService
    {
        Task<TaskItemDto?> CreateTaskAsync(TaskItemCreateDto taskDto, UserRole requestingUserRole); 
        Task<TaskItemDto?> GetTaskByIdAsync(int taskId, UserRole requestingUserRole, int requestingUserId); 
        Task<IEnumerable<TaskItemDto>> GetAllTasksAsync(UserRole requestingUserRole, int requestingUserId);
        Task<TaskItemDto?> UpdateTaskAsync(int taskId, TaskItemUpdateDto taskDto, UserRole requestingUserRole, int requestingUserId);
        Task<bool> UpdateTaskStatusAsync(int taskId, string status, UserRole role, int userId);
        Task<bool> DeleteTaskAsync(int taskId, UserRole requestingUserRole); 
    }
}