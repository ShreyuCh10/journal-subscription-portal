package com.example.JournalSubscription.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class DispatchDTO {

    private Long id;
    private Long subscriptionId;
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

    // ===== GETTERS & SETTERS =====

//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public Long getSubscriptionId() { return subscriptionId; }
//    public void setSubscriptionId(Long subscriptionId) { this.subscriptionId = subscriptionId; }
//
//    public String getUserName() { return userName; }
//    public void setUserName(String userName) { this.userName = userName; }
//
//    public String getUserEmail() { return userEmail; }
//    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
//
//    public String getJournalTitle() { return journalTitle; }
//    public void setJournalTitle(String journalTitle) { this.journalTitle = journalTitle; }
//
//    public String getStatus() { return status; }
//    public void setStatus(String status) { this.status = status; }
//
//    public LocalDateTime getDispatchDate() { return dispatchDate; }
//    public void setDispatchDate(LocalDateTime dispatchDate) { this.dispatchDate = dispatchDate; }
//
//    public LocalDateTime getDeliveryDate() { return deliveryDate; }
//    public void setDeliveryDate(LocalDateTime deliveryDate) { this.deliveryDate = deliveryDate; }
//
//    public String getTrackingNumber() { return trackingNumber; }
//    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
//
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
