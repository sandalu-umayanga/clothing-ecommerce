package com.backend.clothing.models;

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
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // This is crucial for your analytics integration
    // It maps this specific user to a Tableau license or Row-Level Security policy
    @Column(name = "tableau_user_id")
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