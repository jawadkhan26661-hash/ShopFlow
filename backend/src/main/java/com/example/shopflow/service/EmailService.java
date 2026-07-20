package com.example.shopflow.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class EmailService {
    @Autowired(required = false)
    private JavaMailSender mailSender;
    public void sendComplaintAlert(String name, String email, String phone, String subject, String message) {
        if (mailSender == null) {
            System.err.println("❌ ERROR: JavaMailSender is NULL!");
            return;
        }
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo("jawadkhan26661@gmail.com");
        mail.setSubject(" M.J.Z ShopFlow Alert: " + subject);
        mail.setText("User: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\nMessage: " + message);
        mailSender.send(mail);
    }
}