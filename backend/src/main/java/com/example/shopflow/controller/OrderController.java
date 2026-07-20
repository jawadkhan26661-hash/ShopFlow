package com.example.shopflow.controller;

import com.example.shopflow.model.Order;
import com.example.shopflow.repository.OrderRepository;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        order.setStatus("PENDING");
        return orderRepository.save(order);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(id).orElseThrow();
        String newStatus = body.get("status");
        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);
        if (emitters.containsKey(id)) {
            try {
                emitters.get(id).send(SseEmitter.event().name("status-update").data(savedOrder));
            } catch (IOException e) {
                emitters.remove(id);
            }
        }
        return savedOrder;
    }

    @GetMapping(value = "/track/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter trackOrder(@PathVariable Long id) {
        SseEmitter emitter = new SseEmitter(24 * 60 * 60 * 1000L); // 24 hours timeout
        emitters.put(id, emitter);

        emitter.onCompletion(() -> emitters.remove(id));
        emitter.onTimeout(() -> emitters.remove(id));

        return emitter;
    }
}