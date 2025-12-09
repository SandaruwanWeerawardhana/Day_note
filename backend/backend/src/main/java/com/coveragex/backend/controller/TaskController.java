package com.coveragex.backend.controller;

import com.coveragex.backend.service.TaskService;
import com.coveragex.backend.dto.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api")
public class TaskController {

    final TaskService taskService;
    @PostMapping("/tasks")
    public ResponseEntity<Task> create(@RequestBody Task task) {
        Task created = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/tasks/{id}")
    public ResponseEntity<Void> markDone(@PathVariable Long id) {
        taskService.markDone(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/tasks")
    public List<Task> latestFive() {
        return taskService.getLatestFive();
    }

}
