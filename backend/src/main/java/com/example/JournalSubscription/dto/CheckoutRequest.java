package com.example.JournalSubscription.dto;
import lombok.Data;
import java.util.List;
@Data
public class CheckoutRequest {


    private Long userId;
    private Long journalId;

    // NEW FIELDS
    private Integer quantity;
    private Integer years;

    private Double amount;
    private String paymentMethod;

    // Razorpay fields
    private String razorpay_payment_id;
    private String razorpay_order_id;
    private String razorpay_signature;

    // Renewal field
    private Long renewalOfSubscriptionId;

    // Address fields
    private String fullName;
    private String email;
    private String mobile;

    private String address;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private List<CheckoutItem> items;
// ===========================
// Getters & Setters
// ===========================
//    public List<CheckoutItem> getItems() { return items; }
//    public void setItems(List<CheckoutItem> items) { this.items = items; }
//    public Long getUserId() { return userId; }
//    public void setUserId(Long userId) { this.userId = userId; }
//
//    public Long getJournalId() { return journalId; }
//    public void setJournalId(Long journalId) { this.journalId = journalId; }
//
//    public Integer getQuantity() { return quantity; }
//    public void setQuantity(Integer quantity) { this.quantity = quantity; }
//
//    public Integer getYears() { return years; }
//    public void setYears(Integer years) { this.years = years; }
//
//    public Double getAmount() { return amount; }
//    public void setAmount(Double amount) { this.amount = amount; }
//
//    public String getPaymentMethod() { return paymentMethod; }
//    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
//
//    public String getRazorpay_payment_id() { return razorpay_payment_id; }
//    public void setRazorpay_payment_id(String razorpay_payment_id) {
//        this.razorpay_payment_id = razorpay_payment_id;
//    }
//
//    public String getRazorpay_order_id() { return razorpay_order_id; }
//    public void setRazorpay_order_id(String razorpay_order_id) {
//        this.razorpay_order_id = razorpay_order_id;
//    }
//
//    public String getRazorpay_signature() { return razorpay_signature; }
//    public void setRazorpay_signature(String razorpay_signature) {
//        this.razorpay_signature = razorpay_signature;
//    }
//
//    public Long getRenewalOfSubscriptionId() { return renewalOfSubscriptionId; }
//    public void setRenewalOfSubscriptionId(Long renewalOfSubscriptionId) {
//        this.renewalOfSubscriptionId = renewalOfSubscriptionId;
//    }
//
//// Address fields
//
//    public String getFullName() { return fullName; }
//    public void setFullName(String fullName) { this.fullName = fullName; }
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//
//    public String getMobile() { return mobile; }
//    public void setMobile(String mobile) { this.mobile = mobile; }
//
//    public String getAddress() { return address; }
//    public void setAddress(String address) { this.address = address; }
//
//    public String getStreet() { return street; }
//    public void setStreet(String street) { this.street = street; }
//
//    public String getCity() { return city; }
//    public void setCity(String city) { this.city = city; }
//
//    public String getState() { return state; }
//    public void setState(String state) { this.state = state; }
//
//    public String getPincode() { return pincode; }
//    public void setPincode(String pincode) { this.pincode = pincode; }


}
