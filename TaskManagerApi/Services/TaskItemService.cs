using TaskManagerApi.DTOs;
using TaskManagerApi.Models;
using TaskManagerApi.Models.Enums;
using TaskManagerApi.Repositories;

namespace TaskManagerApi.Services
{
    public class TaskItemService : ITaskItemService
    {
        private readonly ITaskItemRepository _taskItemRepository;
        private readonly IUserService _userService; 

        public TaskItemService(ITaskItemRepository taskItemRepository, IUserService userService)
        {
            _taskItemRepository = taskItemRepository;
            _userService = userService;
        }

        public async Task<TaskItemDto?> CreateTaskAsync(TaskItemCreateDto taskDto, UserRole requestingUserRole)
        {
            User? assignedUser = null;
            if (taskDto.AssignedToUserId.HasValue && taskDto.AssignedToUserId.Value > 0)
            {
                assignedUser = await _userService.GetUserByIdInternalAsync(taskDto.AssignedToUserId.Value);
                if (assignedUser == null)
                {
                    return null; 
                }
            }
            var newTask = new TaskItem
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                AssignedToUserId = taskDto.AssignedToUserId,
                Status = Task_Status.ToDo, 
            };

            await _taskItemRepository.AddAsync(newTask);
            await _taskItemRepository.SaveChangesAsync();

            return new TaskItemDto
            {
                Id = newTask.Id,
                Title = newTask.Title,
                Description = newTask.Description,
                Status = newTask.Status,
                AssignedToUserId = newTask.AssignedToUserId,
                AssignedToUsername = assignedUser?.Username ?? "N/A", 
            };
        }

        public async Task<TaskItemDto?> GetTaskByIdAsync(int taskId, UserRole requestingUserRole, int requestingUserId)
        {
            var task = await _taskItemRepository.GetByIdAsync(taskId);
            if (task == null) return null;

            bool isAdmin = (requestingUserRole == UserRole.Admin);
            bool isAssignedToUser = (task.AssignedToUserId == requestingUserId);

            if (!isAdmin && !isAssignedToUser)
            {
                return null; 
            }

            return new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                AssignedToUserId = task.AssignedToUserId,
                AssignedToUsername = task.AssignedToUser?.Username ?? "N/A" 
            };
        }

        public async Task<IEnumerable<TaskItemDto>> GetAllTasksAsync(UserRole requestingUserRole, int requestingUserId)
        {
            if (requestingUserRole != UserRole.Admin)
            {
                var userTasks = await _taskItemRepository.GetTasksByUserIdAsync(requestingUserId);
                return userTasks.Select(t => new TaskItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status,
                    AssignedToUserId = t.AssignedToUserId,
                    AssignedToUsername = t.AssignedToUser?.Username ?? "N/A"
                });
            }

            var allTasks = await _taskItemRepository.GetAllAsync();
            var allTaskDtos = new List<TaskItemDto>();
            foreach (var task in allTasks)
            {
                var assignedUser = await _userService.GetUserByIdInternalAsync(task.AssignedToUserId);
                allTaskDtos.Add(new TaskItemDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    Status = task.Status,
                    AssignedToUserId = task.AssignedToUserId,
                    AssignedToUsername = assignedUser?.Username ?? "N/A"
                });
            }
            return allTaskDtos;
        }

        public async Task<TaskItemDto?> UpdateTaskAsync(int taskId, TaskItemUpdateDto taskDto, UserRole requestingUserRole, int requestingUserId)
        {
            var taskToUpdate = await _taskItemRepository.GetByIdAsync(taskId); 

            if (taskToUpdate == null) return null;

            bool isAdmin = (requestingUserRole == UserRole.Admin);
            bool isAssignedToUser = (taskToUpdate.AssignedToUserId == requestingUserId);

            if (!isAdmin && !isAssignedToUser)
            {
                return null; 
            }

            if (isAdmin)
            {
                if (!string.IsNullOrEmpty(taskDto.Title))
                    taskToUpdate.Title = taskDto.Title;
                if (!string.IsNullOrEmpty(taskDto.Description))
                    taskToUpdate.Description = taskDto.Description;

                if (taskDto.AssignedToUserId.HasValue)
                {
                    var newAssignedUser = await _userService.GetUserByIdInternalAsync(taskDto.AssignedToUserId.Value);
                    if (newAssignedUser == null)
                    {
                        return null; 
                    }
                    taskToUpdate.AssignedToUserId = taskDto.AssignedToUserId.Value;
                    taskToUpdate.AssignedToUser = newAssignedUser;
                }
                else if (taskDto.AssignedToUserId == null) 
                {
                    taskToUpdate.AssignedToUserId = null;
                    taskToUpdate.AssignedToUser = null;
                }

                if (taskDto.Status.HasValue)
                    taskToUpdate.Status = taskDto.Status.Value;
            }
            else 
            {
                if (taskDto.Status.HasValue)
                {
                    taskToUpdate.Status = taskDto.Status.Value;
                }
                else
                {
                    return null; 
                }
            }

            await _taskItemRepository.UpdateAsync(taskToUpdate);
            await _taskItemRepository.SaveChangesAsync();

            return new TaskItemDto
            {
                Id = taskToUpdate.Id,
                Title = taskToUpdate.Title,
                Description = taskToUpdate.Description,
                Status = taskToUpdate.Status,
                AssignedToUserId = taskToUpdate.AssignedToUserId,
                AssignedToUsername = taskToUpdate.AssignedToUser?.Username ?? "N/A",
            };
        }

        public async Task<bool> UpdateTaskStatusAsync(int taskId, string status, UserRole role, int userId)
        {
            var task = await _taskItemRepository.GetByIdAsync(taskId);
            if (task == null)
                return false;

            if (role != UserRole.Admin && task.AssignedToUserId != userId)
                return false;

            if (!Enum.TryParse<Task_Status>(status, out var parsedStatus))
                return false;

            task.Status = parsedStatus;
            await _taskItemRepository.UpdateAsync(task);
            return true;
        }



        public async Task<bool> DeleteTaskAsync(int taskId, UserRole requestingUserRole)
        {
            if (requestingUserRole != UserRole.Admin)
            {
                return false; 
            }

            var taskToDelete = await _taskItemRepository.GetByIdAsync(taskId);
            if (taskToDelete == null) return false;

            await _taskItemRepository.DeleteAsync(taskToDelete);
            await _taskItemRepository.SaveChangesAsync();
            return true;
        }
    }
}