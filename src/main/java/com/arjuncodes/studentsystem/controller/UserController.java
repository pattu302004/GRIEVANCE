package com.arjuncodes.studentsystem.controller;

import com.arjuncodes.studentsystem.model.User;
import com.arjuncodes.studentsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/adduser")
    public String adduser(@RequestBody User user) {
        userService.saveUser(user);
        return "New user is added";
    }

    @PostMapping("/checkuser")
    public ResponseEntity<?> checkUser(@RequestBody User user) {
        User existingUser = userService.findByUsername(user.getUsername());
        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(new UserResponse(
                existingUser.getId(),
                existingUser.getName(),
                existingUser.getContactNumber(),
                existingUser.getEmail(),
                existingUser.getAddress()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect Username/Password");
        }
    }
}

class UserResponse {
    private int id;
    private String name;
    private String contactNumber;
    private String email;
    private String address;

    public UserResponse(int id, String name, String contactNumber, String email, String address) {
        this.id = id;
        this.name = name;
        this.contactNumber = contactNumber;
        this.email = email;
        this.address = address;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }
}