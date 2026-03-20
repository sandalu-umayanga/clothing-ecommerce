package com.backend.clothing.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Always use BigDecimal for currency in Java to avoid rounding errors
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stockQuantity;

    private String category; // e.g., "T-Shirts", "Hoodies"

    @Column(name = "image_url")
    private String imageUrl; // URL to the image stored in your S3/MinIO bucket
}