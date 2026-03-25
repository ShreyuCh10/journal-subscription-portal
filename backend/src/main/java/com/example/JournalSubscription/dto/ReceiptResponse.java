package com.example.JournalSubscription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ReceiptResponse {

    private String receiptNumber;
    private Double amount;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private UUID receiptId; // instead of Long


}