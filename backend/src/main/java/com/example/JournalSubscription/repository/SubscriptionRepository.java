package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByUser(User user);

    Optional<Subscription> findByUserAndStatus(User user, String status);

}
