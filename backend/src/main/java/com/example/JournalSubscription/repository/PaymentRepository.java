package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    List<Payment> findBySubscription_User_Id(UUID userId);




    long countByStatus(Payment.PaymentStatus status);

    Optional<Payment> findTopBySubscription_Id(UUID subscriptionId);
    // ✅ FIXED SUM QUERY
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    Double sumAmountByStatus(Payment.PaymentStatus status);
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS'")
    Double getTotalRevenue();

    @Query("""
SELECT new map(
  FUNCTION('MONTH', p.paymentDate) as month,
  SUM(p.amount) as revenue
)
FROM Payment p
WHERE p.status = 'SUCCESS'
GROUP BY FUNCTION('MONTH', p.paymentDate)
ORDER BY month
""")

    List<Map<String, Object>> getMonthlyRevenue();

    List<Payment> findTop5ByOrderByPaymentDateDesc();
}
