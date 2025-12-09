package com.coveragex.backend.repository;

import com.coveragex.backend.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    @Query("SELECT t FROM TaskEntity t WHERE t.completed = false ORDER BY t.createdAt DESC")
    List<TaskEntity> findTop5ByCreated();
}


