package com.backend.clothing.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "custom_designs")
@Data
public class CustomDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links the design to the user who uploaded it
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "design_file_url", nullable = false)
    private String designFileUrl;

    @Column(columnDefinition = "TEXT")
    private String specifications; // e.g., "100% Cotton, Size L, Print on back"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING_REVIEW, APPROVED, IN_PRODUCTION, SHIPPED
    }
}