package com.example.shopflow.repository;

import com.example.shopflow.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerUsername(String username);
}