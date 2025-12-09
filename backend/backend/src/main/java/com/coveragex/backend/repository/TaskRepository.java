package com.coveragex.backend.repository;

import com.coveragex.backend.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findTop5ByCompletedFalseOrderByCreatedAtDesc();
}
