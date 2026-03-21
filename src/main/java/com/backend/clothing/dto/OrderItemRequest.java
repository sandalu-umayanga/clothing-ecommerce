package com.backend.clothing.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long productId;
    private Long customDesignId;
    private Integer quantity;
}