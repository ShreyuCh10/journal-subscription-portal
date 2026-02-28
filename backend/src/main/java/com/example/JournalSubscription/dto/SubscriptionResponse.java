package com.example.JournalSubscription.dto;

import java.time.LocalDate;

public class SubscriptionResponse {

    private Long id;
    private String journalTitle;
    private String status;
    private Integer months;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long receiptId;   // ✅ ADD THIS

    public SubscriptionResponse(Long id,
                                String journalTitle,
                                String status,
                                Integer months,
                                LocalDate startDate,
                                LocalDate endDate,
                                Long receiptId) {
        this.id = id;
        this.journalTitle = journalTitle;
        this.status = status;
        this.months = months;
        this.startDate = startDate;
        this.endDate = endDate;
        this.receiptId = receiptId;
    }

    public Long getId() { return id; }
    public String getJournalTitle() { return journalTitle; }
    public String getStatus() { return status; }
    public Integer getMonths() { return months; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public Long getReceiptId() { return receiptId; }   // ✅ ADD
}