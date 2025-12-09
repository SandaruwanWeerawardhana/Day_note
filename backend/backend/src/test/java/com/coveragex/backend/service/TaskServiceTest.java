package com.coveragex.backend.service;

import com.coveragex.backend.dto.Task;
import com.coveragex.backend.entity.TaskEntity;
import com.coveragex.backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository repo;

    @Mock
    private ModelMapper mapper;

    @InjectMocks
    private TaskService taskService;

    private TaskEntity taskEntity1;
    private TaskEntity taskEntity2;
    private Task taskDto1;
    private Task taskDto2;

    @BeforeEach
    void setUp() {
        // Setup test data
        taskEntity1 = new TaskEntity();
        taskEntity1.setId(1L);
        taskEntity1.setTitle("Test Task 1");
        taskEntity1.setDescription("Description 1");
        taskEntity1.setCompleted(false);
        taskEntity1.setCreatedAt(LocalDateTime.now().minusDays(1));

        taskEntity2 = new TaskEntity();
        taskEntity2.setId(2L);
        taskEntity2.setTitle("Test Task 2");
        taskEntity2.setDescription("Description 2");
        taskEntity2.setCompleted(false);
        taskEntity2.setCreatedAt(LocalDateTime.now());

        taskDto1 = new Task();
        taskDto1.setId(1L);
        taskDto1.setTitle("Test Task 1");
        taskDto1.setDescription("Description 1");
        taskDto1.setCompleted(false);

        taskDto2 = new Task();
        taskDto2.setId(2L);
        taskDto2.setTitle("Test Task 2");
        taskDto2.setDescription("Description 2");
        taskDto2.setCompleted(false);
    }

    @Test
    void getLatestFive() {
        // Arrange
        List<TaskEntity> entities = Arrays.asList(taskEntity1, taskEntity2);
        when(repo.findTop5ByCreated()).thenReturn(entities);
        when(mapper.map(taskEntity1, Task.class)).thenReturn(taskDto1);
        when(mapper.map(taskEntity2, Task.class)).thenReturn(taskDto2);

        // Act
        List<Task> result = taskService.getLatestFive();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test Task 1", result.get(0).getTitle());
        assertEquals("Test Task 2", result.get(1).getTitle());
        assertFalse(result.get(0).getCompleted());
        assertFalse(result.get(1).getCompleted());

        verify(repo, times(1)).findTop5ByCreated();
        verify(mapper, times(2)).map(any(TaskEntity.class), eq(Task.class));
    }



    @Test
    void createTask() {
        // Arrange
        Task inputTask = new Task();
        inputTask.setTitle("New Task");
        inputTask.setDescription("New Description");
        inputTask.setCompleted(false);

        TaskEntity entityToSave = new TaskEntity();
        entityToSave.setTitle("New Task");
        entityToSave.setDescription("New Description");
        entityToSave.setCompleted(false);

        TaskEntity savedEntity = new TaskEntity();
        savedEntity.setId(3L);
        savedEntity.setTitle("New Task");
        savedEntity.setDescription("New Description");
        savedEntity.setCompleted(false);
        savedEntity.setCreatedAt(LocalDateTime.now());

        Task expectedTask = new Task();
        expectedTask.setId(3L);
        expectedTask.setTitle("New Task");
        expectedTask.setDescription("New Description");
        expectedTask.setCompleted(false);

        when(mapper.map(inputTask, TaskEntity.class)).thenReturn(entityToSave);
        when(repo.save(any(TaskEntity.class))).thenReturn(savedEntity);
        when(mapper.map(savedEntity, Task.class)).thenReturn(expectedTask);

        // Act
        Task result = taskService.createTask(inputTask);

        // Assert
        assertNotNull(result);
        assertEquals(3L, result.getId());
        assertEquals("New Task", result.getTitle());
        assertEquals("New Description", result.getDescription());
        assertFalse(result.getCompleted());

        verify(mapper, times(1)).map(inputTask, TaskEntity.class);
        verify(repo, times(1)).save(any(TaskEntity.class));
        verify(mapper, times(1)).map(savedEntity, Task.class);
    }

    @Test
    void markDone() {
        // Arrange
        Long taskId = 1L;
        TaskEntity existingTask = new TaskEntity();
        existingTask.setId(taskId);
        existingTask.setTitle("Test Task");
        existingTask.setDescription("Test Description");
        existingTask.setCompleted(false);
        existingTask.setCreatedAt(LocalDateTime.now().minusDays(1));

        when(repo.findById(taskId)).thenReturn(Optional.of(existingTask));
        when(repo.save(any(TaskEntity.class))).thenReturn(existingTask);

        taskService.markDone(taskId);

        // Assert
        assertTrue(existingTask.getCompleted(), "Task should be marked as completed");
        verify(repo, times(1)).findById(taskId);
        verify(repo, times(1)).save(existingTask);
    }

}