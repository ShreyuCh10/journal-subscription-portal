package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Payment;
import com.example.JournalSubscription.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/invoice/{invoiceId}")
    public Payment makePayment(@PathVariable Long invoiceId,
                               @RequestParam String method) {
        return paymentService.processPayment(invoiceId, method);
    }
}
