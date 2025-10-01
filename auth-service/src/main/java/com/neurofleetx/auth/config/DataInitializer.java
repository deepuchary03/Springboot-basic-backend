package com.neurofleetx.auth.config;

import com.neurofleetx.auth.model.Product;
import com.neurofleetx.auth.model.Role;
import com.neurofleetx.auth.model.User;
import com.neurofleetx.auth.repository.ProductRepository;
import com.neurofleetx.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create test users
        createTestUsers();
        
        // Create sample products
        createSampleProducts();
    }

    private void createTestUsers() {
        // Only create users if the users table is empty
        if (userRepository.count() == 0) {
            // Create a test user
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setPassword(passwordEncoder.encode("password123"));
            testUser.setRole(Role.CUSTOMER);
            userRepository.save(testUser);
            System.out.println("Test user created: username=testuser, password=password123");

            // Create an admin user
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(Role.ADMIN);
            userRepository.save(adminUser);
            System.out.println("Admin user created: username=admin, password=admin123");
            
            System.out.println("Initial users created. Existing users will be preserved on future restarts.");
        } else {
            System.out.println("Users table already contains data. Preserving existing users.");
        }
    }

    private void createSampleProducts() {
        // Only create products if none exist
        if (productRepository.count() == 0) {
            Product[] products = {
                createProduct("Laptop Pro", 1299.99, "High-performance laptop with 16GB RAM", "Electronics", 25),
                createProduct("Smartphone X", 699.99, "Latest flagship smartphone with advanced camera", "Electronics", 50),
                createProduct("Wireless Headphones", 199.99, "Premium noise-canceling wireless headphones", "Audio", 30),
                createProduct("4K Monitor", 399.99, "27-inch 4K UHD monitor with HDR", "Electronics", 15),
                createProduct("Gaming Mouse", 79.99, "RGB gaming mouse with precision sensor", "Gaming", 40),
                createProduct("Mechanical Keyboard", 129.99, "RGB mechanical keyboard with blue switches", "Gaming", 20),
                createProduct("Tablet Air", 549.99, "Lightweight tablet with stylus support", "Electronics", 35),
                createProduct("Smart Watch", 299.99, "Fitness tracking smartwatch with GPS", "Wearables", 45),
                createProduct("Bluetooth Speaker", 89.99, "Portable waterproof Bluetooth speaker", "Audio", 60),
                createProduct("USB-C Hub", 49.99, "7-in-1 USB-C hub with HDMI and card readers", "Accessories", 80)
            };

            for (Product product : products) {
                productRepository.save(product);
            }
            
            System.out.println("Sample products created: " + products.length + " products added to database");
        }
    }

    private Product createProduct(String name, Double price, String description, String category, Integer stock) {
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);
        product.setCategory(category);
        product.setStockQuantity(stock);
        product.setAvailable(true);
        return product;
    }
}