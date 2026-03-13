package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByInvoice_Id(Long invoiceId);

    Optional<Payment> findTopBySubscription_Id(Long subscriptionId);

    List<Payment> findBySubscription_UserId(Long userId);

    Optional<Payment> findTopBySubscription_IdOrderByPaymentDateDesc(Long subscriptionId);
    long countByStatus(Payment.PaymentStatus status);

    // ✅ Sum payments by status
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    Double sumAmountByStatus(@Param("status") Payment.PaymentStatus status);

}
