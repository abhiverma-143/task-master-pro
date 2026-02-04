package com.abhishek.task_manager.controller;

import com.abhishek.task_manager.entity.Task;
import com.abhishek.task_manager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin("*") // React ke liye permission
public class TaskController {

    @Autowired
    private TaskRepository repo;

    @GetMapping
    public List<Task> getAll() {
        return repo.findAll();
    }

    // 2. CREATE
    @PostMapping
    public Task create(@RequestBody Task task) {
        return repo.save(task);
    }

    // 3. Task ka Status Update karna (JAB HUM DRAG KARENGE)
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Task task = repo.findById(id).orElse(null);
        if (task != null) {
            task.setStatus(taskDetails.getStatus()); // Status change karo
            return repo.save(task); // Save karo
        }
        return null;
    }

    // 4. Task Delete karna
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        repo.deleteById(id);
    }
}