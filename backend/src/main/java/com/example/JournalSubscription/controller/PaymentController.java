package com.example.JournalSubscription.controller;

import org.springframework.security.oauth2.jwt.Jwt;
import com.example.JournalSubscription.dto.PaymentResponse;
import com.example.JournalSubscription.service.PaymentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 🔹 User payments
    @GetMapping("/my-payments")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();

        String clerkUserId = jwt.getSubject();

        return ResponseEntity.ok(
                paymentService.getUserPaymentsByClerkId(clerkUserId)
        );
    }

    // 🔹 Admin - all payments
    @GetMapping
    public List<PaymentResponse> getAllPayments() {
        return paymentService.getAllPayments();
    }
}