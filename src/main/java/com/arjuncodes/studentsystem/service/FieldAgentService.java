package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.FieldAgent;

import java.util.List;

public interface FieldAgentService {
    void saveFieldAgent(FieldAgent agent);
    FieldAgent findByUsername(String username);
    FieldAgent findById(int id);
    void incrementIssueCount(int agentId);
    List<FieldAgent> findBySpecializationOrderByIssueCountAsc(String specialization);
    List<FieldAgent> findAll(); // New method
}