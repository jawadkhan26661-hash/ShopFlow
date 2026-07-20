package com.example.shopflow.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerUsername;
    private Long productId;
    private int quantity;
    private double totalAmount;
    private String status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate = new Date();
}