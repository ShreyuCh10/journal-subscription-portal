package com.example.JournalSubscription.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "dispatch")
public class Dispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    @ManyToOne
    @JoinColumn(name = "journal_id")
    private Journal journal;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DispatchStatus status = DispatchStatus.PENDING;

    private LocalDateTime dispatchDate;
    private LocalDateTime deliveryDate;
    private String trackingNumber;
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ===== GETTERS & SETTERS =====

    public void setSubscription(Subscription subscription) {
        this.subscription = subscription;
    }

    public void setJournal(Journal journal) {
        this.journal = journal;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setStatus(DispatchStatus status) {
        this.status = status;
    }

    public void setDispatchDate(LocalDateTime dispatchDate) {
        this.dispatchDate = dispatchDate;
    }

    public void setDeliveryDate(LocalDateTime deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }
    public void setMonth(Integer month) { this.month = month; }
    public void setYear(Integer year) { this.year = year; }

}