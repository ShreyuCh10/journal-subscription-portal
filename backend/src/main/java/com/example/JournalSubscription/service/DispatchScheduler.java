package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DispatchScheduler {

    private final SubscriptionRepository subscriptionRepository;
    private final DispatchService dispatchService;

    public DispatchScheduler(
            SubscriptionRepository subscriptionRepository,
            DispatchService dispatchService
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.dispatchService = dispatchService;
    }

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void generateMonthlyDispatch() {

        System.out.println("Checking subscriptions for monthly dispatch");

        List<Subscription> subscriptions = subscriptionRepository.findAll();

        LocalDate today = LocalDate.now();

        for (Subscription sub : subscriptions) {

            if (sub.getStatus().name().equals("ACTIVE")) {

                if (today.isBefore(sub.getEndDate()) || today.equals(sub.getEndDate())) {

                    dispatchService.createDispatch(sub.getId());

                }

            }

        }

    }
}
