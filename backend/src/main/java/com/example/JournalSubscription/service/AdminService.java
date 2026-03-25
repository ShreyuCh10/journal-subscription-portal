package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.*;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final JournalRepository journalRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;

    public AdminService(
            UserRepository userRepository,
            JournalRepository journalRepository,
            SubscriptionRepository subscriptionRepository,
            PaymentRepository paymentRepository
    ) {
        this.userRepository = userRepository;
        this.journalRepository = journalRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.paymentRepository = paymentRepository;
    }

    // ================= STATS =================
    public AdminStatsResponse getStats() {

        long totalUsers = userRepository.count();
        long totalJournals = journalRepository.count();
        long activeSubs = subscriptionRepository
                .countByStatus(Subscription.SubscriptionStatus.ACTIVE);

        Double revenue = paymentRepository.getTotalRevenue();
        if (revenue == null) revenue = 0.0;

        return new AdminStatsResponse(
                totalUsers,
                totalJournals,
                activeSubs,
                revenue
        );
    }

    // ================= CHART DATA =================
    public Map<String, Object> getCharts() {

        List<Map<String, Object>> revenueData =
                paymentRepository.getMonthlyRevenue();

        return Map.of(
                "userGrowth", revenueData,   // reuse for now
                "revenueGrowth", revenueData
        );
    }

    // ================= RECENT USERS =================
    public List<UserDto> getRecentUsers() {

        return userRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(u -> new UserDto(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        "Active"
                ))
                .toList();
    }

    // ================= RECENT PAYMENTS =================
    public List<PaymentDto> getRecentPayments() {

        return paymentRepository.findTop5ByOrderByPaymentDateDesc()
                .stream()
                .map(p -> new PaymentDto(
                        p.getId(),
                        p.getSubscription().getUser().getFullName(),  // ✅ FIX
                        p.getAmount(),
                        p.getStatus().name()   // ✅ convert enum → String
                ))
                .toList();
    }
}