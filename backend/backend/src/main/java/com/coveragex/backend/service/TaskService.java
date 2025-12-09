package com.coveragex.backend.service;

import com.coveragex.backend.dto.Task;
import com.coveragex.backend.entity.TaskEntity;
import com.coveragex.backend.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository repo;
    private final ModelMapper mapper;

    public List<Task> getLatestFive() {
        List<TaskEntity> entities = repo.findTop5ByCreated();
        return entities.stream().map(e -> mapper.map(e, Task.class)).collect(Collectors.toList());
    }

    public Task createTask(Task task) {
        TaskEntity entity = mapper.map(task, TaskEntity.class);
        entity.setCreatedAt(LocalDateTime.now());
        TaskEntity saved = repo.save(entity);
        return mapper.map(saved, Task.class);
    }


    public void markDone(Long id) {
        TaskEntity t = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        t.setCompleted(true);
        t.setCompletedAt(LocalDateTime.now());
        repo.save(t);
    }
}
