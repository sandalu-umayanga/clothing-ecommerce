package com.backend.clothing.repositories;

import com.backend.clothing.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Allows a user to see their specific order history
    List<Order> findByUserId(Long userId);
}