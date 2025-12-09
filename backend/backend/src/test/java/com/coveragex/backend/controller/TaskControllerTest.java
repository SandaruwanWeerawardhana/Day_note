package com.coveragex.backend.controller;

import com.coveragex.backend.dto.Task;
import com.coveragex.backend.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    private Task task1;
    private Task task2;

    @BeforeEach
    void setUp() {
        task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Test Task 1");
        task1.setDescription("Description 1");
        task1.setCompleted(false);

        task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Test Task 2");
        task2.setDescription("Description 2");
        task2.setCompleted(false);
    }

    @Test
    void create() throws Exception {
        // Arrange
        Task createdTask = new Task();
        createdTask.setId(1L);
        createdTask.setTitle("New Task");
        createdTask.setDescription("New Description");
        createdTask.setCompleted(false);

        when(taskService.createTask(any(Task.class))).thenReturn(createdTask);

        // Act & Assert
        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"New Task\",\"description\":\"New Description\",\"completed\":false}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("New Task")))
                .andExpect(jsonPath("$.description", is("New Description")))
                .andExpect(jsonPath("$.completed", is(false)));

        verify(taskService, times(1)).createTask(any(Task.class));
    }


    @Test
    void markDone() throws Exception {
        // Arrange
        Long taskId = 1L;
        doNothing().when(taskService).markDone(taskId);

        // Act & Assert
        mockMvc.perform(patch("/api/tasks/{id}", taskId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(taskService, times(1)).markDone(taskId);
    }

    @Test
    void latestFive() throws Exception {
        // Arrange
        List<Task> tasks = Arrays.asList(task1, task2);
        when(taskService.getLatestFive()).thenReturn(tasks);

        // Act & Assert
        mockMvc.perform(get("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Test Task 1")))
                .andExpect(jsonPath("$[0].description", is("Description 1")))
                .andExpect(jsonPath("$[0].completed", is(false)))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].title", is("Test Task 2")))
                .andExpect(jsonPath("$[1].description", is("Description 2")))
                .andExpect(jsonPath("$[1].completed", is(false)));

        verify(taskService, times(1)).getLatestFive();
    }

}