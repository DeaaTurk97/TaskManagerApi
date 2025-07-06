using System.Security.Claims;
using TaskManagerApi.Models.Enums;

namespace TaskManagerApi.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetUserId(this ClaimsPrincipal principal)
        {
            var idClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
            if (idClaim != null && int.TryParse(idClaim.Value, out int userId))
            {
                return userId;
            }
            throw new InvalidOperationException("User ID claim not found or invalid.");
        }

        public static UserRole GetUserRole(this ClaimsPrincipal principal)
        {
            var roleClaim = principal.FindFirst(ClaimTypes.Role);
            if (roleClaim != null && Enum.TryParse(roleClaim.Value, out UserRole role))
            {
                return role;
            }
           
            return UserRole.User;
          
        }
    }
}