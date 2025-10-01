package com.neurofleetx.auth.repository;

import com.neurofleetx.auth.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByAvailable(Boolean available);
    
    List<Product> findByCategory(String category);
    
    @Query("SELECT p FROM Product p WHERE p.available = true ORDER BY p.name ASC")
    List<Product> findAllAvailableProducts();
    
    @Query("SELECT p FROM Product p WHERE p.stockQuantity > 0 AND p.available = true")
    List<Product> findInStockProducts();
}