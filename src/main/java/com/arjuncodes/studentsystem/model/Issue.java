package com.arjuncodes.studentsystem.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "issue")
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "assigned_agent_id")
    private FieldAgent assignedAgent;

    @Column(name = "complaint_type")
    private String complaintType;

    @Column(name = "issue_description")
    private String issueDescription;

    @Column(name = "preferred_resolution_date")
    private LocalDate preferredResolutionDate;

    @Column(name = "preferred_resolution_time")
    private LocalTime preferredResolutionTime;

    @Column(name = "latitude")
    private Double latitude; // New field for GPS

    @Column(name = "longitude")
    private Double longitude; // New field for GPS

    @Column(nullable = false)
    private String status = "Pending";

    @Column(name = "submission_date", nullable = false)
    private LocalDate submissionDate;

    @Column(name = "confirmation_code")
    private String confirmationCode;

    @Column(name = "confirmation_verified")
    private boolean confirmationVerified = false;

    public Issue() {
        this.submissionDate = LocalDate.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public FieldAgent getAssignedAgent() { return assignedAgent; }
    public void setAssignedAgent(FieldAgent assignedAgent) { this.assignedAgent = assignedAgent; }

    public String getComplaintType() { return complaintType; }
    public void setComplaintType(String complaintType) { this.complaintType = complaintType; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }

    public LocalDate getPreferredResolutionDate() { return preferredResolutionDate; }
    public void setPreferredResolutionDate(LocalDate preferredResolutionDate) { this.preferredResolutionDate = preferredResolutionDate; }

    public LocalTime getPreferredResolutionTime() { return preferredResolutionTime; }
    public void setPreferredResolutionTime(LocalTime preferredResolutionTime) { this.preferredResolutionTime = preferredResolutionTime; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDate submissionDate) { this.submissionDate = submissionDate; }

    public String getConfirmationCode() { return confirmationCode; }
    public void setConfirmationCode(String confirmationCode) { this.confirmationCode = confirmationCode; }

    public boolean isConfirmationVerified() { return confirmationVerified; }
    public void setConfirmationVerified(boolean confirmationVerified) { this.confirmationVerified = confirmationVerified; }

    @Override
    public String toString() {
        return "Issue{" +
                "id=" + id +
                ", user=" + (user != null ? user.getId() : null) +
                ", assignedAgent=" + (assignedAgent != null ? assignedAgent.getId() : null) +
                ", complaintType='" + complaintType + '\'' +
                ", issueDescription='" + issueDescription + '\'' +
                ", preferredResolutionDate=" + preferredResolutionDate +
                ", preferredResolutionTime=" + preferredResolutionTime +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", status='" + status + '\'' +
                ", submissionDate=" + submissionDate +
                ", confirmationCode='" + confirmationCode + '\'' +
                ", confirmationVerified=" + confirmationVerified +
                '}';
    }
}