package com.example.JournalSubscription.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class CheckoutResponse {

    private String status;
    private UUID receiptId; // instead of Long
}