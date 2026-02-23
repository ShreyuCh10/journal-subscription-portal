package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    // Find receipt by receipt number
    Optional<Receipt> findByReceiptNumber(String receiptNumber);

    // Find receipt by payment ID

    Optional<Receipt> findByPayment_PaymentId(Long paymentId);
}