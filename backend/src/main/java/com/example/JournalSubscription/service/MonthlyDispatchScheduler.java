package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class MonthlyDispatchScheduler {

    private final SubscriptionRepository subscriptionRepository; // ✅ added
    private final DispatchService dispatchService;               // ✅ added

    public MonthlyDispatchScheduler(
            SubscriptionRepository subscriptionRepository,
            DispatchService dispatchService
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.dispatchService = dispatchService;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void generateMonthlyDispatch() {

        List<Subscription> subscriptions = subscriptionRepository.findAll();
        LocalDate today = LocalDate.now();

        for (Subscription sub : subscriptions) {

            if (sub.getStatus() == Subscription.SubscriptionStatus.ACTIVE &&
                    !today.isAfter(sub.getEndDate())) {

                dispatchService.createDispatch(sub.getId()); // ✅ UUID
            }
        }
    }
}