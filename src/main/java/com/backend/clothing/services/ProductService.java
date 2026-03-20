package com.backend.clothing.services;

import com.backend.clothing.models.Product;
import com.backend.clothing.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Retrieve all products for the main storefront
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Retrieve a single product for the Product Detail page
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Get products by category (e.g., "Hoodies", "T-Shirts")
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    // Admin function: Add a new piece of clothing to the catalog
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Admin function: Update stock, price, or details
    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(updatedProduct.getName());
                    existingProduct.setDescription(updatedProduct.getDescription());
                    existingProduct.setPrice(updatedProduct.getPrice());
                    existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
                    existingProduct.setCategory(updatedProduct.getCategory());
                    existingProduct.setImageUrl(updatedProduct.getImageUrl());
                    return productRepository.save(existingProduct);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    // Admin function: Remove a product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}