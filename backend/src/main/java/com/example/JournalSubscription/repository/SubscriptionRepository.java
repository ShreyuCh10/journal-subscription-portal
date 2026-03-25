package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    long countByStatus(Subscription.SubscriptionStatus status);

    List<Subscription> findByUser_Id(UUID userId);

;

}
