package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.dto.ReceiptResponse;
import com.example.JournalSubscription.entity.Receipt;
import com.example.JournalSubscription.repository.ReceiptRepository;
import com.example.JournalSubscription.service.ReceiptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptRepository receiptRepository;
    private final ReceiptService receiptService;

    public ReceiptController(ReceiptRepository receiptRepository,
                             ReceiptService receiptService) {
        this.receiptRepository = receiptRepository;
        this.receiptService = receiptService;
    }

    @GetMapping("/{id}")
    public ReceiptResponse getReceipt(@PathVariable Long id) {

        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        return new ReceiptResponse(
                receipt.getReceiptNumber(),
                receipt.getPayment().getAmount(),
                receipt.getPayment().getPaymentMethod(),
                receipt.getPayment().getPaymentDate(),
                receipt.getReceiptId()   // ✅ FIXED
        );
    }

    @GetMapping("/download/{receiptId}")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long receiptId) {

        byte[] pdf = receiptService.generateReceiptPdf(receiptId);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=receipt.pdf")
                .body(pdf);
    }

    @GetMapping("/download/payment/{paymentId}")
    public ResponseEntity<byte[]> downloadByPaymentId(
            @PathVariable Long paymentId) {

        Receipt receipt = receiptRepository
                .findByPayment_PaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        byte[] pdf = receiptService.generateReceiptPdf(receipt.getReceiptId());

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=" + receipt.getReceiptNumber() + ".pdf")
                .body(pdf);
    }
}