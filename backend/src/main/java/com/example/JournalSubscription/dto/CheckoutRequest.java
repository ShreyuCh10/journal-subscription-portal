package com.example.JournalSubscription.dto;

public class CheckoutRequest {

    private Long userId;
    private Long journalId;
    private Integer months;
    private Double amount;
    private String paymentMethod;

    // Razorpay fields
    private String razorpay_payment_id;
    private String razorpay_order_id;
    private String razorpay_signature;

    // 🔁 NEW FIELD FOR RENEWAL
    private Long renewalOfSubscriptionId;

    // Getters & Setters

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getJournalId() {
        return journalId;
    }

    public void setJournalId(Long journalId) {
        this.journalId = journalId;
    }

    public Integer getMonths() {
        return months;
    }

    public void setMonths(Integer months) {
        this.months = months;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getRazorpay_payment_id() {
        return razorpay_payment_id;
    }

    public void setRazorpay_payment_id(String razorpay_payment_id) {
        this.razorpay_payment_id = razorpay_payment_id;
    }

    public String getRazorpay_order_id() {
        return razorpay_order_id;
    }

    public void setRazorpay_order_id(String razorpay_order_id) {
        this.razorpay_order_id = razorpay_order_id;
    }

    public String getRazorpay_signature() {
        return razorpay_signature;
    }

    public void setRazorpay_signature(String razorpay_signature) {
        this.razorpay_signature = razorpay_signature;
    }

    // 🔁 Renewal Getter/Setter
    public Long getRenewalOfSubscriptionId() {
        return renewalOfSubscriptionId;
    }

    public void setRenewalOfSubscriptionId(Long renewalOfSubscriptionId) {
        this.renewalOfSubscriptionId = renewalOfSubscriptionId;
    }
}