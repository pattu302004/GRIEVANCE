package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.FieldAgent;
import com.arjuncodes.studentsystem.repository.FieldAgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FieldAgentServiceImpl implements FieldAgentService {
    @Autowired
    private FieldAgentRepository fieldAgentRepository;

    @Override
    public void saveFieldAgent(FieldAgent agent) {
        fieldAgentRepository.save(agent);
    }

    @Override
    public FieldAgent findByUsername(String username) {
        return fieldAgentRepository.findByUsername(username);
    }

    @Override
    public FieldAgent findById(int id) {
        return fieldAgentRepository.findById(id).orElse(null);
    }

    @Override
    public void incrementIssueCount(int agentId) {
        FieldAgent agent = findById(agentId);
        if (agent != null) {
            agent.setIssueCount(agent.getIssueCount() + 1);
            fieldAgentRepository.save(agent);
        }
    }

    @Override
    public List<FieldAgent> findBySpecializationOrderByIssueCountAsc(String specialization) {
        return fieldAgentRepository.findBySpecializationOrderByIssueCountAsc(specialization);
    }

    @Override
    public List<FieldAgent> findAll() {
        return fieldAgentRepository.findAll();
    }
}