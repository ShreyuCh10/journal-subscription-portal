package com.example.JournalSubscription.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long id;

    private Long userId;

    private Long journalId;

    private Integer months;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;

    public enum SubscriptionStatus {
        PENDING,
        ACTIVE,
        INACTIVE,
        CANCELLED
    }
    private LocalDate startDate;
    private LocalDate endDate;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ===== GETTERS & SETTERS =====

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public Long getJournalId() { return journalId; }

    public void setJournalId(Long journalId) { this.journalId = journalId; }

    public Integer getMonths() { return months; }

    public void setMonths(Integer months) { this.months = months; }

    public SubscriptionStatus getStatus() { return status; }

    public void setStatus(SubscriptionStatus status) { this.status = status; }
}