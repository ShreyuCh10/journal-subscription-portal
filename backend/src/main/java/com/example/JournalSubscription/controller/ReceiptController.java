package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Receipt;
import com.example.JournalSubscription.service.ReceiptService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @GetMapping("/payment/{paymentId}")
    public Receipt getReceiptByPayment(@PathVariable Long paymentId) {
        return receiptService.findByPaymentId(paymentId);
    }
}
