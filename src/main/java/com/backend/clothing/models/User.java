package com.backend.clothing.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users") // 'user' is a reserved keyword in Postgres, so we use 'users'
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore // CRITICAL: Never return the password hash in API responses!
    private String passwordHash;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String city;
    private String zipCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // This is crucial for your analytics integration
    // It maps this specific user to a Tableau license or Row-Level Security policy
    @Column(name = "tableau_user_id")
    @JsonIgnore // Sensitive internal ID
    private String tableauUserId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum Role {
        CUSTOMER, ADMIN
    }
}