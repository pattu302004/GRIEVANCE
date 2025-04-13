package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.Issue;
import com.arjuncodes.studentsystem.model.ReopenRequest;
import com.arjuncodes.studentsystem.repository.IssueRepository;
import com.arjuncodes.studentsystem.repository.ReopenRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class IssueServiceImpl implements IssueService {
    @Autowired
    private IssueRepository issueRepository;
    @Autowired
    private ReopenRequestRepository reopenRequestRepository;
    @Override
    public void saveIssue(Issue issue) {
        issueRepository.save(issue);
    }

    @Override
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @Override
    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    @Override
    public List<Issue> getIssuesByStatus(String status) {
        return issueRepository.findByStatus(status);
    }

    @Override
    public List<Issue> getIssuesByUserId(int userId) {
        return issueRepository.findByUserId(userId);
    }

    @Override
    public List<Issue> getIssuesByAssignedAgentId(int agentId) {
        return issueRepository.findByAssignedAgentId(agentId);
    }

    @Override
    public List<Issue> getIssuesBySubmissionDateAsc() {
        return issueRepository.findAllByOrderBySubmissionDateAsc();
    }

    @Override
    public List<Issue> getIssuesBySubmissionDateDesc() {
        return issueRepository.findAllByOrderBySubmissionDateDesc();
    }

    @Override
    public List<Issue> getIssuesByComplaintType(String complaintType) {
        return issueRepository.findByComplaintType(complaintType);
    }

    @Override
    public List<Issue> getIssuesBySubmissionDateBetween(LocalDate startDate, LocalDate endDate) {
        return issueRepository.findBySubmissionDateBetween(startDate, endDate);
    }

    @Override
    public List<Issue> getIssuesByPreferredResolutionDateBetween(LocalDate startDate, LocalDate endDate) {
        return issueRepository.findByPreferredResolutionDateBetween(startDate, endDate);
    }

    @Override
    public List<Issue> getIssuesWithFilters(String status, String complaintType, LocalDate submissionStartDate, 
                                            LocalDate submissionEndDate, LocalDate resolutionStartDate, LocalDate resolutionEndDate) {
        return issueRepository.findWithFilters(status, complaintType, submissionStartDate, submissionEndDate, 
                                               resolutionStartDate, resolutionEndDate);
    } 

    public void deleteIssueById(Long id) {
        issueRepository.deleteById(id);
    }
    @Override
    public void saveReopenRequest(ReopenRequest reopenRequest) {
        reopenRequestRepository.save(reopenRequest);
    }

    @Override
    public List<ReopenRequest> getAllReopenRequests() {
        return reopenRequestRepository.findAll();
    }

    @Override
    public Optional<ReopenRequest> getReopenRequestById(Long id) {
        return reopenRequestRepository.findById(id);
    }

    @Override
    public void deleteReopenRequestById(Long id) {
        reopenRequestRepository.deleteById(id);
    }
}