package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import com.example.JournalSubscription.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                               UserRepository userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    // Create Subscription
    public Subscription createSubscription(Long userId, Integer durationYears) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setDurationYears(durationYears);
        subscription.setStartDate(LocalDateTime.now());
        subscription.setEndDate(LocalDateTime.now().plusYears(durationYears));
        subscription.setStatus(Subscription.SubscriptionStatus.PENDING);

        return subscriptionRepository.save(subscription);
    }

    // Find by user
    public List<Subscription> findByUser(User user) {
        return subscriptionRepository.findByUser(user);
    }

    // Find by user & status
    public Optional<Subscription> findByUserAndStatus(User user, String status) {
        return subscriptionRepository.findByUserAndStatus(user, status);
    }

    public List<Subscription> findAll() {
        return subscriptionRepository.findAll();
    }

    public Subscription findById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
    }

    // Delete
    public void deleteSubscription(Long id) {
        subscriptionRepository.deleteById(id);
    }
}