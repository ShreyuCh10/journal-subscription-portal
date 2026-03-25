package com.example.JournalSubscription.entity;
import lombok.*;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;

    @OneToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    private Double amount;
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    public enum PaymentStatus {
        SUCCESS, FAILED, PENDING, REFUNDED
    }

    private String razorpayPaymentId;
    private String razorpayOrderId;

    private LocalDateTime paymentDate;

    @PrePersist
    public void onCreate() {
        this.paymentDate = LocalDateTime.now();
    }
}