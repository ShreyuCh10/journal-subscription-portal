package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.dto.PaymentResponse;
import com.example.JournalSubscription.service.PaymentService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 🔐 USER PAYMENTS (SECURE)
    @GetMapping("/my-payments")
    public List<PaymentResponse> getUserPayments() {
        return paymentService.getUserPayments(); // ✅ FIXED
    }

    // 🔐 ADMIN ONLY
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<PaymentResponse> getAllPayments() {
        return paymentService.getAllPayments();
    }
}