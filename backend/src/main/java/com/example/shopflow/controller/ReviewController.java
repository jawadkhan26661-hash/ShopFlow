package com.example.shopflow.controller;

import com.example.shopflow.model.Review;
import com.example.shopflow.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }
}