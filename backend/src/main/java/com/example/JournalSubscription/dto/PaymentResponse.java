package com.example.JournalSubscription.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PaymentResponse {

    private UUID id;
    private Double amount;
    private String status;
    private LocalDateTime paymentDate;
    private String razorpayPaymentId;
    private String journalTitle;
    private String userName; // optional
}