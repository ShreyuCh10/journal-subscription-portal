package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.ReportSummaryDTO;
import com.example.JournalSubscription.entity.Payment;
import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.repository.*;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private final UserRepository userRepository;
    private final JournalRepository journalRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;

    public ReportService(UserRepository userRepository,
                         JournalRepository journalRepository,
                         SubscriptionRepository subscriptionRepository,
                         PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.journalRepository = journalRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.paymentRepository = paymentRepository;
    }

    public ReportSummaryDTO getSummary() {
        ReportSummaryDTO dto = new ReportSummaryDTO();

        // Users
        dto.setTotalUsers(userRepository.count());
        dto.setSubscribedUsers(userRepository.countBySubscribed(true));
        dto.setInterestedUsers(userRepository.countByInterested(true));

        // Journals
        dto.setTotalJournals(journalRepository.count());

        // Subscriptions
        dto.setTotalSubscriptions(subscriptionRepository.count());
        dto.setActiveSubscriptions(subscriptionRepository.countByStatus(Subscription.SubscriptionStatus.ACTIVE));

        // Payments
        dto.setTotalPayments(paymentRepository.count());
        dto.setSuccessfulPayments(paymentRepository.countByStatus(Payment.PaymentStatus.SUCCESS));
        dto.setFailedPayments(paymentRepository.countByStatus(Payment.PaymentStatus.FAILED));

        // Revenue (sum of successful payments)
        Double revenue = paymentRepository.sumAmountByStatus(Payment.PaymentStatus.SUCCESS);
        dto.setTotalRevenue(revenue != null ? revenue : 0.0);

        return dto;
    }
}
