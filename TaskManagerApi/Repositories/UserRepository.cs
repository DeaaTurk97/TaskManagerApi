using TaskManagerApi.Data;
using TaskManagerApi.Models;
using Microsoft.EntityFrameworkCore; 

namespace TaskManagerApi.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _dbSet.SingleOrDefaultAsync(u => u.Username == username);
        }
    }
}