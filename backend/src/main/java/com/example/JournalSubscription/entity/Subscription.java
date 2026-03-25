package com.example.JournalSubscription.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
@Data
public class Subscription {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    // 🔥 RELATION instead of userId string
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 🔥 RELATION instead of journalId
    @ManyToOne
    @JoinColumn(name = "journal_id", nullable = false)
    private Journal journal;

    private Integer quantity;
    private Integer years;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;

    public enum SubscriptionStatus {
        PENDING, ACTIVE, INACTIVE, CANCELLED
    }

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shipping_address_id")
    private Address shippingAddress;

    private String reminderSent;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}