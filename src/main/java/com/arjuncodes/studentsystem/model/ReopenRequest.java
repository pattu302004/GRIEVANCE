package com.arjuncodes.studentsystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reopen_request")
public class ReopenRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "image_path")
    private String imagePath; // Path to store the uploaded image

    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;

    @Column(name = "previous_agent_id")
    private Integer previousAgentId; // Store the ID of the previous agent

    public ReopenRequest() {
        this.requestDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Issue getIssue() { return issue; }
    public void setIssue(Issue issue) { this.issue = issue; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }

    public Integer getPreviousAgentId() { return previousAgentId; }
    public void setPreviousAgentId(Integer previousAgentId) { this.previousAgentId = previousAgentId; }
}