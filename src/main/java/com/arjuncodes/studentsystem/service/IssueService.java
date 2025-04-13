package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.Issue;
import com.arjuncodes.studentsystem.model.ReopenRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IssueService {
    void saveIssue(Issue issue);
    List<Issue> getAllIssues();
    Optional<Issue> getIssueById(Long id);
    List<Issue> getIssuesByStatus(String status);
    List<Issue> getIssuesByUserId(int userId);
    List<Issue> getIssuesByAssignedAgentId(int agentId);
    List<Issue> getIssuesBySubmissionDateAsc();
    List<Issue> getIssuesBySubmissionDateDesc();
    List<Issue> getIssuesByComplaintType(String complaintType);
    List<Issue> getIssuesBySubmissionDateBetween(LocalDate startDate, LocalDate endDate);
    List<Issue> getIssuesByPreferredResolutionDateBetween(LocalDate startDate, LocalDate endDate);
    List<Issue> getIssuesWithFilters(String status, String complaintType, LocalDate submissionStartDate, LocalDate submissionEndDate, LocalDate resolutionStartDate, LocalDate resolutionEndDate);
    void deleteIssueById(Long id);
    void saveReopenRequest(ReopenRequest reopenRequest);
    List<ReopenRequest> getAllReopenRequests();
    Optional<ReopenRequest> getReopenRequestById(Long id);
    void deleteReopenRequestById(Long id);
    
}