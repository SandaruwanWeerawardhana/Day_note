package com.coveragex.backend.controller;

import com.coveragex.backend.entity.TaskEntity;
import com.coveragex.backend.repository.TaskRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    @AfterEach
    void tearDown() {
        taskRepository.deleteAll();
    }

    @Test
    void create_ShouldCreateNewTask() throws Exception {
        // Arrange
        String taskJson = "{\"title\":\"Integration Test Task\",\"description\":\"Test Description\",\"completed\":false}";

        // Act & Assert
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(taskJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title", is("Integration Test Task")))
                .andExpect(jsonPath("$.description", is("Test Description")))
                .andExpect(jsonPath("$.completed", is(false)));

        // Verify in database
        assertEquals(1, taskRepository.count());
        TaskEntity savedTask = taskRepository.findAll().getFirst();
        assertEquals("Integration Test Task", savedTask.getTitle());
        assertEquals("Test Description", savedTask.getDescription());
        assertFalse(savedTask.getCompleted());
        assertNotNull(savedTask.getCreatedAt());
    }


    @Test
    void markDone_ShouldUpdateTaskToCompleted() throws Exception {
        // Arrange - Create a task first
        TaskEntity task = new TaskEntity();
        task.setTitle("Task to Complete");
        task.setDescription("Description");
        task.setCompleted(false);
        task.setCreatedAt(LocalDateTime.now());
        TaskEntity savedTask = taskRepository.save(task);

        // Act & Assert
        mockMvc.perform(patch("/api/tasks/{id}", savedTask.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        // Verify in database
        TaskEntity updatedTask = taskRepository.findById(savedTask.getId()).orElseThrow();
        assertTrue(updatedTask.getCompleted());
        assertEquals("Task to Complete", updatedTask.getTitle());
        assertEquals("Description", updatedTask.getDescription());
    }

    @Test
    void latestFive_ShouldReturnLatestTasks() throws Exception {
        // Arrange - Create multiple tasks
        TaskEntity task1 = new TaskEntity();
        task1.setTitle("Task 1");
        task1.setDescription("Description 1");
        task1.setCompleted(false);
        task1.setCreatedAt(LocalDateTime.now().minusDays(3));
        taskRepository.save(task1);

        TaskEntity task2 = new TaskEntity();
        task2.setTitle("Task 2");
        task2.setDescription("Description 2");
        task2.setCompleted(false);
        task2.setCreatedAt(LocalDateTime.now().minusDays(2));
        taskRepository.save(task2);

        TaskEntity task3 = new TaskEntity();
        task3.setTitle("Task 3");
        task3.setDescription("Description 3");
        task3.setCompleted(false);
        task3.setCreatedAt(LocalDateTime.now().minusDays(1));
        taskRepository.save(task3);

        // Act & Assert
        mockMvc.perform(get("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].title", is("Task 3")))
                .andExpect(jsonPath("$[1].title", is("Task 2")))
                .andExpect(jsonPath("$[2].title", is("Task 1")));
    }

    @Test
    void latestFive_ShouldReturnEmptyList_WhenNoTasks() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void latestFive_ShouldOnlyReturnIncompleteTasks() throws Exception {
        // Arrange - Create completed and incomplete tasks
        TaskEntity completedTask = new TaskEntity();
        completedTask.setTitle("Completed Task");
        completedTask.setDescription("Description");
        completedTask.setCompleted(true);
        completedTask.setCreatedAt(LocalDateTime.now().minusDays(1));
        taskRepository.save(completedTask);

        TaskEntity incompleteTask = new TaskEntity();
        incompleteTask.setTitle("Incomplete Task");
        incompleteTask.setDescription("Description");
        incompleteTask.setCompleted(false);
        incompleteTask.setCreatedAt(LocalDateTime.now());
        taskRepository.save(incompleteTask);

        // Act & Assert
        mockMvc.perform(get("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Incomplete Task")))
                .andExpect(jsonPath("$[0].completed", is(false)));
    }


}
