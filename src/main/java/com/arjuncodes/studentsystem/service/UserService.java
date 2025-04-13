package com.arjuncodes.studentsystem.service;

import com.arjuncodes.studentsystem.model.User;

public interface UserService {
    void saveUser(User user);
    User findByUsername(String username);
    User findById(int id);
}