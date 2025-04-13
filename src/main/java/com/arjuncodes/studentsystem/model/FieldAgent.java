package com.arjuncodes.studentsystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "field_agent")
public class FieldAgent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String username;
    private String password;
    private String contactNumber;
    private String email;
    private String address;
    private String dateOfBirth;
    private String specialization; // New field for specialization area
    private int issueCount; // New field to track the number of assigned issues

    public FieldAgent() {
        this.issueCount = 0; // Initialize issueCount to 0
    }

    public FieldAgent(String name, String username, String password, String contactNumber, String email, String address, String dateOfBirth, String specialization) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.contactNumber = contactNumber;
        this.email = email;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.specialization = specialization;
        this.issueCount = 0; // Initialize issueCount to 0
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getIssueCount() {
        return issueCount;
    }

    public void setIssueCount(int issueCount) {
        this.issueCount = issueCount;
    }
}