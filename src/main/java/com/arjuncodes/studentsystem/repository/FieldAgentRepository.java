package com.arjuncodes.studentsystem.repository;

import com.arjuncodes.studentsystem.model.FieldAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldAgentRepository extends JpaRepository<FieldAgent, Integer> {
    FieldAgent findByUsername(String username);
    List<FieldAgent> findBySpecializationOrderByIssueCountAsc(String specialization);
}