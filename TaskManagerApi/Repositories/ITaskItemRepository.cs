using TaskManagerApi.Models; 

namespace TaskManagerApi.Repositories
{
    public interface ITaskItemRepository : IGenericRepository<TaskItem>
    {
        Task<TaskItem?> GetByIdAsync(int? id);
        Task<IEnumerable<TaskItem>> GetTasksByUserIdAsync(int userId);
    }
}