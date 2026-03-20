package com.backend.clothing.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The order this item belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // The specific product bought
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    // Alternatively, if they bought a custom design instead of a standard product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "custom_design_id")
    private CustomDesign customDesign;

    @Column(nullable = false)
    private Integer quantity;

    // Always store the price at the time of purchase!
    // If the product price goes up tomorrow, this order's history shouldn't change.
    @Column(name = "price_at_purchase", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtPurchase;
}