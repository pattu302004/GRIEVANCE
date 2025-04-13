package com.arjuncodes.studentsystem.controller;

import com.arjuncodes.studentsystem.model.FieldAgent;
import com.arjuncodes.studentsystem.model.Issue;
import com.arjuncodes.studentsystem.model.ReopenRequest;
import com.arjuncodes.studentsystem.model.User;
import com.arjuncodes.studentsystem.service.FieldAgentService;
import com.arjuncodes.studentsystem.service.IssueService;
import com.arjuncodes.studentsystem.service.UserService;
import com.arjuncodes.studentsystem.service.EmailService;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/issue")
@CrossOrigin(origins = "http://localhost:3000")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserService userService;

    @Autowired
    private FieldAgentService fieldAgentService;

    @Autowired
    private EmailService emailService;

    private static final String UPLOAD_DIR = "/Users/akahya/grievance_uploads/reopen_images/"; // Replace "john" with your username

    @PostMapping("/submit")
    public ResponseEntity<String> submitIssue(@RequestBody IssueRequest issueRequest) {
        System.out.println("Received issue request: " + issueRequest); // Log the request
        try {
            User user = userService.findById(issueRequest.getUserId());
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
    
            Issue issue = new Issue();
            issue.setUser(user);
            issue.setComplaintType(issueRequest.getComplaintType());
            issue.setIssueDescription(issueRequest.getIssueDescription());
            issue.setPreferredResolutionDate(issueRequest.getPreferredResolutionDate());
            issue.setPreferredResolutionTime(issueRequest.getPreferredResolutionTime());
            issue.setStatus("Pending");
    
            issueService.saveIssue(issue);
            return ResponseEntity.ok("Issue submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting issue: " + e.getMessage());
        }
    }

    @PutMapping("/initiate-completion/{id}")
    public ResponseEntity<String> initiateCompletion(@PathVariable Long id) {
        Optional<Issue> optionalIssue = issueService.getIssueById(id);
        if (optionalIssue.isPresent()) {
            Issue issue = optionalIssue.get();
            String code = generateRandomCode();
            issue.setConfirmationCode(code);
            issue.setStatus("Waiting for Customer Confirmation");

            issueService.saveIssue(issue);

            User user = issue.getUser();
            String subject = "Confirm Your Complaint Resolution";
            String body = "Dear " + user.getName() + ",\n\n" +
                    "To confirm that your issue '" + issue.getComplaintType() + "' has been resolved, " +
                    "please give this code to the field agent: " + code + "\n\nThank you!";

            emailService.sendEmail(user.getEmail(), subject, body);

            return ResponseEntity.ok("Confirmation code sent to user");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/verify-code/{id}")
    public ResponseEntity<String> verifyCode(@PathVariable Long id, @RequestParam String code) {
        Optional<Issue> optionalIssue = issueService.getIssueById(id);
        if (optionalIssue.isPresent()) {
            Issue issue = optionalIssue.get();
            if (issue.getConfirmationCode() != null && issue.getConfirmationCode().equals(code)) {
                issue.setStatus("Completed");
                issue.setConfirmationVerified(true);
                issueService.saveIssue(issue);

                String subject = "Issue Successfully Closed";
                String body = "Dear " + issue.getUser().getName() + ",\n\nYour complaint has been marked as resolved. " +
                        "Thank you for confirming!\n\n- Municipal Team";
                emailService.sendEmail(issue.getUser().getEmail(), subject, body);

                return ResponseEntity.ok("Code verified. Issue marked as completed.");
            } else {
                return ResponseEntity.badRequest().body("Invalid code");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIssueIfPending(@PathVariable Long id) {
        Optional<Issue> optionalIssue = issueService.getIssueById(id);
        if (!optionalIssue.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Issue issue = optionalIssue.get();
        if (!"Pending".equalsIgnoreCase(issue.getStatus())) {
            return ResponseEntity.badRequest().body("Issue cannot be withdrawn as it is already assigned or completed.");
        }

        issueService.deleteIssueById(id);
        return ResponseEntity.ok("Issue withdrawn successfully.");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Issue>> getIssuesByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(issueService.getIssuesByUserId(userId));
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<String> updateIssueStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Issue> optionalIssue = issueService.getIssueById(id);
        if (optionalIssue.isPresent()) {
            Issue issue = optionalIssue.get();
            issue.setStatus(status);
            issueService.saveIssue(issue);

            if ("Completed".equalsIgnoreCase(status)) {
                User user = issue.getUser();
                String subject = "Your Grievance Has Been Resolved";
                String body = "Dear " + user.getName() + ",\n\n"
                        + "Your grievance titled '" + issue.getComplaintType() + "' has been successfully resolved.\n\n"
                        + "Thank you for your patience.\n\n"
                        + "Best regards,\nMunicipal Officer Team";

                emailService.sendEmail(user.getEmail(), subject, body);
            }

            return ResponseEntity.ok("Issue status updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Issue>> getIssuesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(issueService.getIssuesByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long id) {
        Optional<Issue> optionalIssue = issueService.getIssueById(id);
        return optionalIssue.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/assign/{id}")
    public ResponseEntity<String> assignIssueToAgent(@PathVariable Long id, @RequestParam int agentId) {
        Optional<Issue> optionalIssue = issueService.getIssueById(id);
        if (!optionalIssue.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        FieldAgent agent = fieldAgentService.findById(agentId);
        if (agent == null) {
            return ResponseEntity.badRequest().body("Field agent not found");
        }

        Issue issue = optionalIssue.get();
        if (!issue.getComplaintType().equals(agent.getSpecialization())) {
            return ResponseEntity.badRequest().body("Field agent's specialization does not match the complaint type");
        }

        issue.setAssignedAgent(agent);
        issue.setStatus("Assigned");
        issueService.saveIssue(issue);
        fieldAgentService.incrementIssueCount(agentId);
        return ResponseEntity.ok("Issue assigned successfully");
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<Issue>> getIssuesByAssignedAgentId(@PathVariable int agentId) {
        return ResponseEntity.ok(issueService.getIssuesByAssignedAgentId(agentId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Issue>> getIssuesWithFilters(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String complaintType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate submissionStartDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate submissionEndDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate resolutionStartDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate resolutionEndDate) {
        return ResponseEntity.ok(issueService.getIssuesWithFilters(status, complaintType, submissionStartDate,
                submissionEndDate, resolutionStartDate, resolutionEndDate));
    }

    @PostMapping(value = "/reopen-request", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> submitReopenRequest(
            @RequestParam("issueId") Long issueId,
            @RequestParam("userId") int userId,
            @RequestParam("image") MultipartFile image) {
        try {
            Optional<Issue> optionalIssue = issueService.getIssueById(issueId);
            if (!optionalIssue.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Issue issue = optionalIssue.get();
            if (!"Completed".equalsIgnoreCase(issue.getStatus())) {
                return ResponseEntity.badRequest().body("Only completed issues can be reopened.");
            }

            User user = userService.findById(userId);
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                System.out.println("Attempting to create directory: " + dir.getAbsolutePath());
                boolean created = dir.mkdirs();
                if (!created) {
                    System.err.println("Failed to create directory: " + dir.getAbsolutePath());
                    return ResponseEntity.badRequest().body("Failed to create upload directory: " + UPLOAD_DIR);
                } else {
                    System.out.println("Directory created successfully: " + dir.getAbsolutePath());
                }
            } else {
                System.out.println("Directory already exists: " + dir.getAbsolutePath());
            }

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            File file = new File(dir, fileName);
            System.out.println("Saving image to: " + file.getAbsolutePath());
            image.transferTo(file);

            ReopenRequest reopenRequest = new ReopenRequest();
            reopenRequest.setIssue(issue);
            reopenRequest.setUser(user);
            reopenRequest.setImagePath(file.getPath());
            reopenRequest.setPreviousAgentId(issue.getAssignedAgent() != null ? issue.getAssignedAgent().getId() : null);
            issueService.saveReopenRequest(reopenRequest);

            issue.setStatus("Reopen Requested");
            issueService.saveIssue(issue);

            return ResponseEntity.ok("Reopen request submitted successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error uploading image: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error submitting reopen request: " + e.getMessage());
        }
    }

    @GetMapping("/reopen-requests")
    public ResponseEntity<List<ReopenRequestDTO>> getAllReopenRequests() {
        List<ReopenRequest> requests = issueService.getAllReopenRequests();
        List<ReopenRequestDTO> dtos = requests.stream().map(request -> {
            String previousAgentName = "None";
            Integer previousAgentId = request.getPreviousAgentId();
            if (previousAgentId != null) {
                FieldAgent agent = fieldAgentService.findById(previousAgentId);
                previousAgentName = (agent != null) ? agent.getName() : "Unknown";
            }
            return new ReopenRequestDTO(
                request.getId(),
                request.getIssue().getId(),
                request.getUser().getName(),
                previousAgentName
            );
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping(value = "/reopen-image/{requestId}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getReopenImage(@PathVariable Long requestId) {
        Optional<ReopenRequest> optionalRequest = issueService.getReopenRequestById(requestId);
        if (!optionalRequest.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ReopenRequest request = optionalRequest.get();
        try {
            File file = new File(request.getImagePath());
            if (!file.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            byte[] imageBytes = Files.readAllBytes(file.toPath());
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/reopen/{requestId}")
    public ResponseEntity<String> approveReopenRequest(@PathVariable Long requestId, @RequestBody ReopenApprovalRequest approvalRequest) {
        if (requestId == null) {
            return ResponseEntity.badRequest().body("Request ID cannot be null or undefined");
        }

        Optional<ReopenRequest> optionalRequest = issueService.getReopenRequestById(requestId);
        if (!optionalRequest.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reopen request not found for ID: " + requestId);
        }

        ReopenRequest reopenRequest = optionalRequest.get();
        Issue issue = reopenRequest.getIssue();
        FieldAgent newAgent = fieldAgentService.findById(approvalRequest.getNewAgentId());
        if (newAgent == null) {
            return ResponseEntity.badRequest().body("New field agent not found");
        }

        if (reopenRequest.getPreviousAgentId() != null && newAgent.getId() == reopenRequest.getPreviousAgentId()) {
            return ResponseEntity.badRequest().body("Cannot assign the same agent who previously handled this issue");
        }

        if (!issue.getComplaintType().equals(newAgent.getSpecialization())) {
            return ResponseEntity.badRequest().body("New agent's specialization does not match the complaint type");
        }

        issue.setAssignedAgent(newAgent);
        issue.setStatus("Assigned");
        issueService.saveIssue(issue);

        issueService.deleteReopenRequestById(requestId);

        String subject = "Your Issue Reopen Request Approved";
        String body = "Dear " + issue.getUser().getName() + ",\n\n" +
                "Your request to reopen issue '" + issue.getComplaintType() + "' has been approved. " +
                "A new field agent has been assigned.\n\nThank you!";
        emailService.sendEmail(issue.getUser().getEmail(), subject, body);

        return ResponseEntity.ok("Issue reopened and assigned to new agent successfully");
    }

    @PostMapping("/reopen/reject/{requestId}")
    public ResponseEntity<String> rejectReopenRequest(@PathVariable Long requestId) {
        if (requestId == null) {
            return ResponseEntity.badRequest().body("Request ID cannot be null or undefined");
        }
    
        Optional<ReopenRequest> optionalRequest = issueService.getReopenRequestById(requestId);
        if (!optionalRequest.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reopen request not found for ID: " + requestId);
        }
    
        ReopenRequest reopenRequest = optionalRequest.get();
        Issue issue = reopenRequest.getIssue();
    
        // Update issue status to "Rejected"
        issue.setStatus("Rejected");
        issueService.saveIssue(issue);
    
        // Delete the reopen request
        issueService.deleteReopenRequestById(requestId);
    
        String subject = "Your Issue Reopen Request Rejected";
        String body = "Dear " + issue.getUser().getName() + ",\n\n" +
                "Your request to reopen issue '" + issue.getComplaintType() + "' has been reviewed and rejected. " +
                "If you have further concerns, please submit a new grievance.\n\nThank you!";
        emailService.sendEmail(issue.getUser().getEmail(), subject, body);
    
        return ResponseEntity.ok("Reopen request rejected successfully");
    }
    private String generateRandomCode() {
        int length = 6;
        String digits = "0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            code.append(digits.charAt(random.nextInt(digits.length())));
        }
        return code.toString();
    }
}

class IssueRequest {
    private int userId;
    private String complaintType;
    private String issueDescription;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate preferredResolutionDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime preferredResolutionTime;

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getComplaintType() { return complaintType; }
    public void setComplaintType(String complaintType) { this.complaintType = complaintType; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }

    public LocalDate getPreferredResolutionDate() { return preferredResolutionDate; }
    public void setPreferredResolutionDate(LocalDate preferredResolutionDate) { this.preferredResolutionDate = preferredResolutionDate; }

    public LocalTime getPreferredResolutionTime() { return preferredResolutionTime; }
    public void setPreferredResolutionTime(LocalTime preferredResolutionTime) { this.preferredResolutionTime = preferredResolutionTime; }
}

class ReopenApprovalRequest {
    private int newAgentId;

    public int getNewAgentId() { return newAgentId; }
    public void setNewAgentId(int newAgentId) { this.newAgentId = newAgentId; }
}

class ReopenRequestDTO {
    private Long id;
    private Long issueId;
    private String userName;
    private String previousAgentName;

    public ReopenRequestDTO(Long id, Long issueId, String userName, String previousAgentName) {
        this.id = id;
        this.issueId = issueId;
        this.userName = userName;
        this.previousAgentName = previousAgentName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIssueId() { return issueId; }
    public void setIssueId(Long issueId) { this.issueId = issueId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getPreviousAgentName() { return previousAgentName; }
    public void setPreviousAgentName(String previousAgentName) { this.previousAgentName = previousAgentName; }
}