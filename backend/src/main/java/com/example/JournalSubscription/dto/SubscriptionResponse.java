package com.example.JournalSubscription.dto;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class SubscriptionResponse {

    private UUID id;
    private UUID userId;
    private UUID journalId;
    private String journalTitle;
    private String status;

    private Integer quantity;
    private Integer years;

    private LocalDate startDate;
    private LocalDate endDate;
    private UUID receiptId;
    private String userName;


    public SubscriptionResponse(UUID id,
                                UUID userId,
                                UUID journalId,
                                String journalTitle,
                                String status,
                                Integer quantity,
                                Integer years,
                                LocalDate startDate,
                                LocalDate endDate,
                                UUID receiptId,
                                String userName) {

        this.id = id;
        this.userId = userId;
        this.journalId = journalId;
        this.journalTitle = journalTitle;
        this.status = status;
        this.quantity = quantity;
        this.years = years;
        this.startDate = startDate;
        this.endDate = endDate;
        this.receiptId = receiptId;
        this.userName =userName;
    }

// ================= GETTERS =================

//    public Long getId() { return id; }
//
//    public Long getUserId() { return userId; }
//
//    public Long getJournalId() { return journalId; }
//
//    public String getJournalTitle() { return journalTitle; }
//
//    public String getStatus() { return status; }
//
//    public Integer getQuantity() { return quantity; }
//
//    public Integer getYears() { return years; }
//
//    public LocalDate getStartDate() { return startDate; }
//
//    public LocalDate getEndDate() { return endDate; }
//
//    public Long getReceiptId() { return receiptId; }
//
//// ================= SETTERS =================
//
//    public void setId(Long id) { this.id = id; }
//
//    public void setUserId(Long userId) { this.userId = userId; }
//
//    public void setJournalId(Long journalId) { this.journalId = journalId; }
//
//    public void setJournalTitle(String journalTitle) { this.journalTitle = journalTitle; }
//
//    public void setStatus(String status) { this.status = status; }
//
//    public void setQuantity(Integer quantity) { this.quantity = quantity; }
//
//    public void setYears(Integer years) { this.years = years; }
//
//    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
//
//    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
//
//    public void setReceiptId(Long receiptId) { this.receiptId = receiptId; }


}
