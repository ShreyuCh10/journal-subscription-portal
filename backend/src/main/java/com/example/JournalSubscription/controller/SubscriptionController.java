package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.JournalSubscription.dto.SubscriptionResponse;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/{id}")
    public Subscription getSubscription(@PathVariable Long id) {
        return subscriptionService.findById(id);
    }

    @GetMapping
    public List<Subscription> getAll() {
        return subscriptionService.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<SubscriptionResponse> getByUser(@PathVariable Long userId) {
        return subscriptionService.findByUserId(userId);
    }
    @PutMapping("/cancel/{id}")
    public String cancelSubscription(@PathVariable Long id) {
        subscriptionService.cancelSubscription(id);
        return "Subscription cancelled successfully";
    }
    @PutMapping("/renew/{oldSubscriptionId}")
    public ResponseEntity<?> renewSubscription(
            @PathVariable Long oldSubscriptionId,
            @RequestParam Integer months
    ) {
        try {
            Long newSubscriptionId =
                    subscriptionService.renewSubscription(oldSubscriptionId, months);

            return ResponseEntity.ok(
                    "Subscription renewed. New subscription ID: " + newSubscriptionId
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
