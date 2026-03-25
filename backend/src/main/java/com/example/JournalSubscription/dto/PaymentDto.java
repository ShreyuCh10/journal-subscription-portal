package com.example.JournalSubscription.dto;

import java.util.UUID;

public class PaymentDto {

    private UUID id;
    private String userName;
    private double amount;
    private String status;

    public PaymentDto(UUID id, String userName, double amount, String status) {
        this.id = id;
        this.userName = userName;
        this.amount = amount;
        this.status = status;
    }

    public UUID getId() { return id; }
    public String getUserName() { return userName; }
    public double getAmount() { return amount; }
    public String getStatus() { return status; }
}
