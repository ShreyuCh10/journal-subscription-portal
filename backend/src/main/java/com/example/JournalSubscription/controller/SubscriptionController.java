package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.service.SubscriptionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/user/{userId}")

    public Subscription createSubscription(@PathVariable Long userId,
                                           @RequestParam Integer durationYears) {
        return subscriptionService.createSubscription(userId, durationYears);
    }
    @GetMapping("/{id}")
    public Subscription getSubscription(@PathVariable Long id) {
        return subscriptionService.findById(id);
    }

    @GetMapping
    public List<Subscription> getAll() {
        return subscriptionService.findAll();
    }
}
