package com.example.JournalSubscription.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class DispatchDTO {
    private UUID id;
    private UUID subscriptionId;
    private String userName;
    private String userEmail;
    private String journalTitle;
    private String status;
    private LocalDateTime dispatchDate;
    private LocalDateTime deliveryDate;
    private String trackingNumber;
    private LocalDateTime createdAt;
    private Integer month;
    private Integer year;
    private Integer quantity;


}
