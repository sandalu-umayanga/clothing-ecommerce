package com.backend.clothing.controllers;

import com.backend.clothing.models.User;
import com.backend.clothing.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // A simple endpoint to register a user for testing
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // In a real scenario, you would hash the password here.
        // For testing, we are just saving the raw JSON to the database.
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
}