package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.dto.ReceiptResponse;
import com.example.JournalSubscription.entity.Receipt;
import com.example.JournalSubscription.entity.Payment;
import com.example.JournalSubscription.service.ReceiptService;
import com.example.JournalSubscription.service.CurrentUserService;
import com.example.JournalSubscription.repository.PaymentRepository;
import com.example.JournalSubscription.repository.ReceiptRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;
    private final PaymentRepository paymentRepository;
    private final ReceiptRepository receiptRepository;
    private final CurrentUserService currentUserService;

    public ReceiptController(
            ReceiptService receiptService,
            PaymentRepository paymentRepository,
            ReceiptRepository receiptRepository,
            CurrentUserService currentUserService
    ) {
        this.receiptService = receiptService;
        this.paymentRepository = paymentRepository;
        this.receiptRepository = receiptRepository;
        this.currentUserService = currentUserService;
    }

    // ================== GET RECEIPT DETAILS ==================
    @GetMapping("/payment/{paymentId}")
    public ReceiptResponse getReceiptByPayment(@PathVariable UUID paymentId) { // ✅ FIXED

        var user = currentUserService.getCurrentUser();

        Payment payment = paymentRepository.findById(paymentId) // ✅ UUID
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // ✅ FIXED (relationship)
        if (!payment.getSubscription().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        Receipt receipt = receiptRepository.findByPayment(payment)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        return new ReceiptResponse(
                receipt.getReceiptNumber(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentDate(),
                receipt.getId() // ✅ FIXED
        );
    }

    // ================== DOWNLOAD RECEIPT ==================
    @GetMapping("/download/payment/{paymentId}")
    public ResponseEntity<byte[]> downloadByPaymentId(
            @PathVariable UUID paymentId) { // ✅ FIXED

        byte[] pdf = receiptService.generateReceiptPdfByPayment(paymentId); // ✅ UUID

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=receipt-" + paymentId + ".pdf")
                .body(pdf);
    }
}