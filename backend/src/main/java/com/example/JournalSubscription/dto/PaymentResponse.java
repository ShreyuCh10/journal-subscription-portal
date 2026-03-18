package com.example.JournalSubscription.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class PaymentResponse {

    private Long id;
    private Double amount;
    private String status;
    private String journalTitle;
    private LocalDateTime paymentDate;
    private String razorpayPaymentId;
    private String userName;

//    // Getters and Setters
//    public String getUserName() {      // ✅ ADD
//        return userName;
//    }
//
//    public void setUserName(String userName) {  // ✅ ADD
//        this.userName = userName;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public Double getAmount() {
//        return amount;
//    }
//
//    public void setAmount(Double amount) {
//        this.amount = amount;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//
//    public String getJournalTitle() {
//        return journalTitle;
//    }
//
//    public void setJournalTitle(String journalTitle) {
//        this.journalTitle = journalTitle;
//    }
//
//    public LocalDateTime getPaymentDate() {
//        return paymentDate;
//    }
//
//    public void setPaymentDate(LocalDateTime paymentDate) {
//        this.paymentDate = paymentDate;
//    }
//
//    public String getRazorpayPaymentId() {
//        return razorpayPaymentId;
//    }
//
//    public void setRazorpayPaymentId(String razorpayPaymentId) {
//        this.razorpayPaymentId = razorpayPaymentId;
//    }
}
