package com.arjuncodes.studentsystem.controller;

import com.arjuncodes.studentsystem.model.FieldAgent;
import com.arjuncodes.studentsystem.service.FieldAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/field-agent")
@CrossOrigin
public class FieldAgentController {
    @Autowired
    private FieldAgentService fieldAgentService;

    @PostMapping("/addagent")
    public ResponseEntity<String> addFieldAgent(@RequestBody FieldAgent agent) {
        try {
            fieldAgentService.saveFieldAgent(agent);
            return ResponseEntity.ok("Field agent registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error registering field agent: " + e.getMessage());
        }
    }

    @PostMapping("/checkagent")
    public ResponseEntity<?> checkFieldAgent(@RequestBody FieldAgent agent) {
        FieldAgent existingAgent = fieldAgentService.findByUsername(agent.getUsername());
        if (existingAgent == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (!existingAgent.getPassword().equals(agent.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect password");
        }
        return ResponseEntity.ok(existingAgent);
    }


    @GetMapping("/{id}")
    public ResponseEntity<FieldAgent> getFieldAgentById(@PathVariable int id) {
        FieldAgent agent = fieldAgentService.findById(id);
        if (agent != null) {
            return ResponseEntity.ok(agent);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-specialization/{specialization}")
    public ResponseEntity<List<FieldAgent>> getFieldAgentsBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(fieldAgentService.findBySpecializationOrderByIssueCountAsc(specialization));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FieldAgent>> getAllFieldAgents() {
        return ResponseEntity.ok(fieldAgentService.findAll());
    }
}