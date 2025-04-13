package com.arjuncodes.studentsystem.repository;

import com.arjuncodes.studentsystem.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByStatus(String status);
    List<Issue> findByUserId(int userId);
    List<Issue> findByAssignedAgentId(int agentId);
    List<Issue> findAllByOrderBySubmissionDateAsc();
    List<Issue> findAllByOrderBySubmissionDateDesc();
    List<Issue> findByComplaintType(String complaintType);

    @Query("SELECT i FROM Issue i WHERE i.submissionDate BETWEEN :startDate AND :endDate")
    List<Issue> findBySubmissionDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT i FROM Issue i WHERE i.preferredResolutionDate BETWEEN :startDate AND :endDate")
    List<Issue> findByPreferredResolutionDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT i FROM Issue i WHERE " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:complaintType IS NULL OR i.complaintType = :complaintType) AND " +
           "(:submissionStartDate IS NULL OR i.submissionDate >= :submissionStartDate) AND " +
           "(:submissionEndDate IS NULL OR i.submissionDate <= :submissionEndDate) AND " +
           "(:resolutionStartDate IS NULL OR i.preferredResolutionDate >= :resolutionStartDate) AND " +
           "(:resolutionEndDate IS NULL OR i.preferredResolutionDate <= :resolutionEndDate) " +
           "ORDER BY i.submissionDate DESC")
    List<Issue> findWithFilters(
        @Param("status") String status,
        @Param("complaintType") String complaintType,
        @Param("submissionStartDate") LocalDate submissionStartDate,
        @Param("submissionEndDate") LocalDate submissionEndDate,
        @Param("resolutionStartDate") LocalDate resolutionStartDate,
        @Param("resolutionEndDate") LocalDate resolutionEndDate
    );
}