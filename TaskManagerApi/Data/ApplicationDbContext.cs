using Microsoft.EntityFrameworkCore;
using TaskManagerApi.Models; 
using BCrypt.Net;
using TaskManagerApi.Models.Enums;

namespace TaskManagerApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

       
        public DbSet<User> Users { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

           
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.AssignedToUser)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.AssignedToUserId);

           
            var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("AdminPassword123");
            var userPasswordHash = BCrypt.Net.BCrypt.HashPassword("UserPassword123");

            var adminUser = new User
            {
                Id = 1,
                Username = "admin",
                PasswordHash = adminPasswordHash, 
                Role = UserRole.Admin 
            };

            var regularUser = new User
            {
                Id = 2,
                Username = "user",
                PasswordHash = userPasswordHash, 
                Role = UserRole.User 
            };
            var regularUser1 = new User
            {
                Id = 3,
                Username = "deaa",
                PasswordHash = userPasswordHash,
                Role = UserRole.User
            };

            modelBuilder.Entity<User>().HasData(adminUser, regularUser);

          
            modelBuilder.Entity<TaskItem>().HasData(
                new TaskItem
                {
                    Id = 1,
                    Title = "Admin's First Task",
                    Description = "This task is for the administrator.",
                    Status = Task_Status.InProgress, 
                    AssignedToUserId = adminUser.Id
                },
                new TaskItem
                {
                    Id = 2,
                    Title = "User's Priority Task",
                    Description = "This is a critical task for the regular user.",
                    Status = Task_Status.ToDo, 
                    AssignedToUserId = regularUser.Id
                },
                new TaskItem
                {
                    Id = 3,
                    Title = "Admin's Completed Task",
                    Description = "An example of a completed task by admin.",
                    Status = Task_Status.Done, 
                    AssignedToUserId = adminUser.Id
                }
            );
        }
    }
}