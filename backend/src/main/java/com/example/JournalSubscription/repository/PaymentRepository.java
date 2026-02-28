package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByInvoice_Id(Long invoiceId);
    Optional<Payment> findTopBySubscription_Id(Long subscriptionId);
}
