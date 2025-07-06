using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.DTOs;
using TaskManagerApi.Services;
using TaskManagerApi.Models.Enums;
using TaskManagerApi.Extensions; 

namespace TaskManagerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class TasksController : ControllerBase
    {
        private readonly ITaskItemService _taskItemService;

        public TasksController(ITaskItemService taskItemService)
        {
            _taskItemService = taskItemService;
        }

       
        [HttpPost]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> CreateTask([FromBody] TaskItemCreateDto taskDto)
        {
            var requestingUserRole = User.GetUserRole();

            var newTask = await _taskItemService.CreateTaskAsync(taskDto, requestingUserRole);
            if (newTask == null)
            {
                return BadRequest(new { message = "Could not create task. Not authorized or assigned user does not exist." });
            }
            return CreatedAtAction(nameof(GetTaskById), new { id = newTask.Id }, newTask);
        }

       
        [HttpGet("{id}")]
        [Authorize(Roles = nameof(UserRole.Admin) + "," + nameof(UserRole.User))]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var requestingUserRole = User.GetUserRole();
            var requestingUserId = User.GetUserId();

            var task = await _taskItemService.GetTaskByIdAsync(id, requestingUserRole, requestingUserId);
            if (task == null)
            {
                return NotFound(new { message = "Task not found or you are not authorized to view this task." });
            }
            return Ok(task);
        }

      
        [HttpGet]
        [Authorize(Roles = nameof(UserRole.Admin) + "," + nameof(UserRole.User))]
        public async Task<IActionResult> GetAllTasks()
        {
            var requestingUserRole = User.GetUserRole();
            var requestingUserId = User.GetUserId();

            var tasks = await _taskItemService.GetAllTasksAsync(requestingUserRole, requestingUserId);
            return Ok(tasks);
        }


        [HttpPut("{id}")]
        [Authorize(Roles = nameof(UserRole.Admin) + "," + nameof(UserRole.User))]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItemUpdateDto taskDto)
        {
            var requestingUserRole = User.GetUserRole();
            var requestingUserId = User.GetUserId();

            var updatedTask = await _taskItemService.UpdateTaskAsync(id, taskDto, requestingUserRole, requestingUserId);
            if (updatedTask == null)
            {
                return BadRequest(new { message = "Could not update task. Task not found, not authorized, or data invalid." });
            }
            return Ok(updatedTask);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = nameof(UserRole.Admin) + "," + nameof(UserRole.User))]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] TaskStatusUpdateDto dto)
        {
            var role = User.GetUserRole();
            var userId = User.GetUserId();

            var success = await _taskItemService.UpdateTaskStatusAsync(id, dto.Status, role, userId);
            if (!success)
                return BadRequest(new { message = "Failed to update task status." });

            return NoContent();
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = nameof(UserRole.Admin))]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var requestingUserRole = User.GetUserRole();

            var result = await _taskItemService.DeleteTaskAsync(id, requestingUserRole);
            if (!result)
            {
                return NotFound(new { message = "Task not found or you are not authorized to delete this task." });
            }
            return NoContent();
        }
    }
}