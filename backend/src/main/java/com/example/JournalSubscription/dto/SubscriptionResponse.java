package com.example.JournalSubscription.dto;

import java.time.LocalDate;

public class SubscriptionResponse {

    private Long id;
    private Long userId;
    private Long journalId;
    private String journalTitle;
    private String status;
    private Integer months;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long receiptId;

    public SubscriptionResponse(Long id,
                                Long userId,
                                Long journalId,
                                String journalTitle,
                                String status,
                                Integer months,
                                LocalDate startDate,
                                LocalDate endDate,
                                Long receiptId) {

        this.id = id;
        this.userId = userId;
        this.journalId = journalId;
        this.journalTitle = journalTitle;
        this.status = status;
        this.months = months;
        this.startDate = startDate;
        this.endDate = endDate;
        this.receiptId = receiptId;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getJournalId() { return journalId; }
    public String getJournalTitle() { return journalTitle; }
    public String getStatus() { return status; }
    public Integer getMonths() { return months; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public Long getReceiptId() { return receiptId; }
}