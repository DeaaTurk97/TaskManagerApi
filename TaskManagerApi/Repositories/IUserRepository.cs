using TaskManagerApi.Models;

namespace TaskManagerApi.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetUserByUsernameAsync(string username);
    }
}