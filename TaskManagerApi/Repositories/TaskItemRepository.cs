using TaskManagerApi.Data;
using TaskManagerApi.Models;
using Microsoft.EntityFrameworkCore; 

namespace TaskManagerApi.Repositories
{
    public class TaskItemRepository : GenericRepository<TaskItem>, ITaskItemRepository
    {
        public TaskItemRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByUserIdAsync(int userId)
        {
            return await _dbSet
                         .Where(t => t.AssignedToUserId == userId)
                         .Include(t => t.AssignedToUser)
                         .ToListAsync();
        }
    }
}