package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.JournalSubscription.dto.SubscriptionResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public Subscription getSubscription(@PathVariable UUID id) { // ✅ FIXED
        return subscriptionService.findById(id);
    }

    // ================= GET ALL =================
    @GetMapping
    public List<SubscriptionResponse> getAllSubscriptions() {
        return subscriptionService.findAll();
    }

    // ================= GET MY SUBSCRIPTIONS =================
    @GetMapping("/my")
    public List<SubscriptionResponse> getMySubscriptions() { // ✅ NO userId
        return subscriptionService.getMySubscriptions();
    }

    // ================= CANCEL =================
    @PutMapping("/cancel/{id}")
    public String cancelSubscription(@PathVariable UUID id) { // ✅ FIXED
        subscriptionService.cancelSubscription(id);
        return "Subscription cancelled successfully";
    }

    // ================= RENEW =================
    @PutMapping("/renew/{oldSubscriptionId}")
    public ResponseEntity<?> renewSubscription(
            @PathVariable UUID oldSubscriptionId, // ✅ FIXED
            @RequestParam Integer years
    ) {
        try {

            UUID newSubscriptionId =
                    subscriptionService.renewSubscription(oldSubscriptionId, years);

            return ResponseEntity.ok(
                    "Subscription renewed. New subscription ID: " + newSubscriptionId
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}