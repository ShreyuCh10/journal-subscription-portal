package com.example.JournalSubscription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ReceiptResponse {

    private String receiptNumber;
    private Double amount;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private Long receiptId;


}