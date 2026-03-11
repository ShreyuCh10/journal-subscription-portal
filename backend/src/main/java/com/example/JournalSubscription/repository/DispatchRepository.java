package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Dispatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DispatchRepository extends JpaRepository<Dispatch, Long> {
    boolean existsBySubscriptionIdAndDispatchDateBetween(
            Long subscriptionId,
            LocalDate start,
            LocalDate end
    );
    Optional<Dispatch> findByTrackingNumber(String trackingNumber);
    List<Dispatch> findBySubscriptionIdIn(List<Long> subscriptionIds);
}
