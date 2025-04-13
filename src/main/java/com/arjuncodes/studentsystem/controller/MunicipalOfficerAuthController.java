package com.arjuncodes.studentsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/municipal-officer-auth")
@CrossOrigin
public class MunicipalOfficerAuthController {

    private static final String OFFICER_USERNAME = "admin";
    private static final String OFFICER_PASSWORD = "admin123";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MunicipalOfficerCredentials credentials) {
        if (OFFICER_USERNAME.equals(credentials.getUsername()) && OFFICER_PASSWORD.equals(credentials.getPassword())) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }
}

class MunicipalOfficerCredentials {
    private String username;
    private String password;

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
}