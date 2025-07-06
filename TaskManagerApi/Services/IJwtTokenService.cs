using TaskManagerApi.Models;

namespace TaskManagerApi.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}