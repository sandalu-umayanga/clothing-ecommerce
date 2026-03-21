package com.backend.clothing.controllers;

import com.backend.clothing.dto.AuthResponse;
import com.backend.clothing.dto.LoginRequest;
import com.backend.clothing.dto.RegisterRequest;
import com.backend.clothing.models.User;
import com.backend.clothing.repositories.UserRepository;
import com.backend.clothing.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setZipCode(request.getZipCode());
        user.setRole(User.Role.CUSTOMER);
        user.setTableauUserId("tab_" + UUID.randomUUID().toString().substring(0, 8));

        User savedUser = userRepository.save(user);

        // Generate the JWT
        String jwtToken = jwtService.generateToken(savedUser);

        // Return it in the response
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new AuthResponse(
                    savedUser.getId(), 
                    savedUser.getEmail(), 
                    savedUser.getRole().name(), 
                    "Registration successful", 
                    jwtToken,
                    savedUser.getFirstName(),
                    savedUser.getLastName(),
                    savedUser.getPhoneNumber(),
                    savedUser.getAddress(),
                    savedUser.getCity(),
                    savedUser.getZipCode()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {

                // Generate the JWT
                String jwtToken = jwtService.generateToken(user);

                // Return it in the response
                return ResponseEntity.ok(
                        new AuthResponse(
                            user.getId(), 
                            user.getEmail(), 
                            user.getRole().name(), 
                            "Login successful", 
                            jwtToken,
                            user.getFirstName(),
                            user.getLastName(),
                            user.getPhoneNumber(),
                            user.getAddress(),
                            user.getCity(),
                            user.getZipCode()
                        )
                );
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Invalid email or password");
    }
}