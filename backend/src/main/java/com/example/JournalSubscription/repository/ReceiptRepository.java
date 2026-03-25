package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Payment;
import com.example.JournalSubscription.entity.Receipt;
import io.micrometer.observation.ObservationFilter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReceiptRepository extends JpaRepository<Receipt, UUID> {

    Optional<Receipt> findByReceiptNumber(String receiptNumber);

    Optional<Receipt> findByPayment(Payment payment);

    Optional<Receipt> findTopByPayment_Subscription_IdOrderByGeneratedAtDesc(UUID subscriptionId);

    // ✅ Correct
    Optional<Receipt> findByPayment_Id(UUID paymentId);

    // ✅ Correct (if Payment has Subscription object)
    Optional<Receipt> findByPayment_Subscription_Id(UUID subscriptionId);
}