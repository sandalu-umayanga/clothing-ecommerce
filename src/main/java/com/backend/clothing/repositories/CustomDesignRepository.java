package com.backend.clothing.repositories;

import com.backend.clothing.models.CustomDesign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomDesignRepository extends JpaRepository<CustomDesign, Long> {
    // Allows users to see the status of their custom design requests
    List<CustomDesign> findByUserId(Long userId);
}