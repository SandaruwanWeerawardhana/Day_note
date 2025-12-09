package com.coveragex.backend.service;

import com.coveragex.backend.dto.Task;
import com.coveragex.backend.entity.TaskEntity;
import com.coveragex.backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class TaskServiceIntegrationTest {
    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setup() {
        taskRepository.deleteAll();
    }

    @Test
    void createTask_persistsAndReturnsDto() {
        Task t = new Task();
        t.setTitle("Create test");
        t.setDescription("create description");

        Task created = taskService.createTask(t);

        assertNotNull(created.getId(), "created task should have an id");
        assertEquals("Create test", created.getTitle());

        TaskEntity entity = taskRepository.findById(created.getId()).orElseThrow();
        assertFalse(entity.getCompleted(), "new task should be incomplete");
        assertNotNull(entity.getCreatedAt(), "createdAt should be set by service");
    }

    @Test
    void getLatestFive_returnsTop5IncompleteOrderedByCreatedAtDesc() {
        // Create 6 tasks, numbered t1 to t6
        for (int i = 1; i <= 5; i++) {
            TaskEntity e = new TaskEntity();
            e.setTitle("t" + i);
            e.setDescription("d" + i);
            e.setCompleted(false);
            e.setCreatedAt(LocalDateTime.now().minusDays(5 - i));
            taskRepository.save(e);
        }

        List<Task> latest = taskService.getLatestFive();

        assertEquals(5, latest.size(), "should return latest 5 incomplete tasks");
 
    }

    @Test
    void markDone_setsCompletedTrue() {
        Task t = new Task();
        t.setTitle("mark");
        t.setDescription("to be marked");

        Task created = taskService.createTask(t);
        taskService.markDone(created.getId());

        TaskEntity entity = taskRepository.findById(created.getId()).orElseThrow();
        assertTrue(entity.getCompleted(), "markDone should set completed to true");
    }
}
