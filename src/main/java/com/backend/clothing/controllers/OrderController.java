package com.backend.clothing.controllers;

import com.backend.clothing.dto.OrderRequest;
import com.backend.clothing.models.Order;
import com.backend.clothing.models.User;
import com.backend.clothing.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestBody OrderRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Order order = orderService.createOrder(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getUserOrders(user.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam Order.OrderStatus status, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        
        // Find the existing order to check ownership
        return orderService.getUserOrders(currentUser.getId()).stream()
                .filter(o -> o.getId().equals(id))
                .findFirst()
                .map(order -> {
                    // Customers can only cancel their own PENDING orders
                    if (currentUser.getRole() == User.Role.CUSTOMER) {
                        if (status == Order.OrderStatus.CANCELLED && order.getStatus() == Order.OrderStatus.PENDING) {
                            return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
                        } else {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Customers can only cancel PENDING orders.");
                        }
                    }
                    // Admins can change status to anything
                    return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
                })
                .orElseGet(() -> {
                    // If not found in user's orders, check if current user is ADMIN
                    if (currentUser.getRole() == User.Role.ADMIN) {
                        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
                    }
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                });
    }
}