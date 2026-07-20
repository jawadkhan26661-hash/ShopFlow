package com.example.shopflow.controller;

import com.example.shopflow.model.Complaint;
import com.example.shopflow.repository.ComplaintRepository;
import com.example.shopflow.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/complaint")
    public ResponseEntity<?> submitComplaint(@RequestBody Complaint complaint) {
        Complaint saved = complaintRepository.save(complaint);

        try {
            emailService.sendComplaintAlert(
                    complaint.getName(),
                    complaint.getEmail(),
                    complaint.getPhone(),
                    complaint.getSubject(),
                    complaint.getMessage()
            );
        } catch (Exception e) {
            System.err.println("Email Delivery Error: " + e.getMessage());
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "Complaint registered and Email Alert dispatched to jawadkhan26661@gmail.com");
        return ResponseEntity.ok(response);
    }
}