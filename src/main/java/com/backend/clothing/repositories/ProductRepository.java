package com.backend.clothing.repositories;

import com.backend.clothing.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Allows the frontend to filter clothes by category (e.g., "Hoodies")
    List<Product> findByCategory(String category);
}