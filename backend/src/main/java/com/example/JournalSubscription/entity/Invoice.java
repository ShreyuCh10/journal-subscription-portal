package com.example.JournalSubscription.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true)
    private String invoiceNumber;

    private Double amount;

    private LocalDateTime issuedDate;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    // ✅ RELATION
    @ManyToOne
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;
}