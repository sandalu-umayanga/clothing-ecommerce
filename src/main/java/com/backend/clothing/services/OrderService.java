package com.backend.clothing.services;

import com.backend.clothing.dto.OrderItemRequest;
import com.backend.clothing.dto.OrderRequest;
import com.backend.clothing.models.*;
import com.backend.clothing.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomDesignRepository customDesignRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        CustomDesignRepository customDesignRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customDesignRepository = customDesignRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order createOrder(Long userId, OrderRequest request) {
        // Fetch fresh user to ensure it's attached to the persistence context
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setItems(new ArrayList<>());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setQuantity(itemRequest.getQuantity());

            if (itemRequest.getProductId() != null) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));
                orderItem.setProduct(product);
                orderItem.setPriceAtPurchase(product.getPrice());
                
                if (product.getStockQuantity() < itemRequest.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }
                product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
                productRepository.save(product);

            } else if (itemRequest.getCustomDesignId() != null) {
                CustomDesign customDesign = customDesignRepository.findById(itemRequest.getCustomDesignId())
                        .orElseThrow(() -> new RuntimeException("Custom design not found: " + itemRequest.getCustomDesignId()));
                
                if (customDesign.getStatus() != CustomDesign.Status.APPROVED) {
                    throw new RuntimeException("Custom design must be APPROVED before ordering.");
                }

                orderItem.setCustomDesign(customDesign);
                orderItem.setPriceAtPurchase(new BigDecimal("45.00")); // Hardcoded
            } else {
                throw new RuntimeException("Order item must have either a product or a custom design.");
            }

            BigDecimal itemTotal = orderItem.getPriceAtPurchase().multiply(new BigDecimal(orderItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}