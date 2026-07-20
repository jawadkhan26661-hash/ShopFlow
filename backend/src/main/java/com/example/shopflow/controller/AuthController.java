package com.example.shopflow.controller;

import com.example.shopflow.model.User;
import com.example.shopflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByUsername(user.getUsername())) {
            response.put("message", "Username already exists!");
            return ResponseEntity.badRequest().body(response);
        }

        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        response.put("message", "Registration successful!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginReq) {
        Map<String, String> response = new HashMap<>();

        return userRepository.findByUsername(loginReq.getUsername())
                .filter(u -> passwordEncoder.matches(loginReq.getPassword(), u.getPassword()))
                .map(u -> {
                    response.put("message", "Login successful!");
                    response.put("username", u.getUsername());
                    response.put("role", u.getRole());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("message", "Invalid username or password");
                    return ResponseEntity.status(401).body(response);
                });
    }
}