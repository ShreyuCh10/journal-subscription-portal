package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.SubscriptionResponse;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.*;


import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final JournalRepository journalRepository;
    private final ReceiptRepository receiptRepository;
    private final PaymentRepository paymentRepository;
    private final RazorpayService razorpayService;
    private final DispatchRepository dispatchRepository;
    private final UserRepository userRepository;

    public SubscriptionService(
            SubscriptionRepository subscriptionRepository,
            JournalRepository journalRepository,
            ReceiptRepository receiptRepository,
            PaymentRepository paymentRepository,
            RazorpayService razorpayService,
            DispatchRepository dispatchRepository,
            UserRepository userRepository) {

        this.subscriptionRepository = subscriptionRepository;
        this.journalRepository = journalRepository;
        this.receiptRepository = receiptRepository;
        this.paymentRepository = paymentRepository;
        this.razorpayService = razorpayService;
        this.dispatchRepository=dispatchRepository;
        this.userRepository=userRepository;
    }

    // =====================================================
    // FIND BY ID
    // =====================================================

    public Subscription findById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
    }

    // =====================================================
    // FETCH ALL SUBSCRIPTIONS
    // =====================================================

    public List<SubscriptionResponse> findAll() {

        return subscriptionRepository.findAll().stream().map(sub -> {

            // ✅ FIXED VARIABLE
            User user = userRepository.findById(sub.getUserId()).orElse(null);

            String userName = user != null ? user.getFullName() : "Unknown";

            String journalTitle = journalRepository
                    .findById(sub.getJournalId())
                    .map(Journal::getTitle)
                    .orElse("Unknown Journal");

            Long receiptId = receiptRepository
                    .findTopByPayment_Subscription_IdOrderByGeneratedAtDesc(sub.getId())
                    .map(Receipt::getReceiptId)
                    .orElse(null);

            return new SubscriptionResponse(
                    sub.getId(),
                    sub.getUserId(),
                    sub.getJournalId(),
                    journalTitle,
                    sub.getStatus().name(),
                    sub.getQuantity(),
                    sub.getYears(),
                    sub.getStartDate(),
                    sub.getEndDate(),
                    receiptId,
                    userName   // ✅ NEW FIELD
            );

        }).toList();
    }

    // =====================================================
    // FETCH USER SUBSCRIPTIONS
    // =====================================================

    public List<SubscriptionResponse> findByUserId(Long userId) {

        return subscriptionRepository.findByUserId(userId).stream().map(sub -> {

            User user = userRepository.findById(sub.getUserId()).orElse(null);
            String userName = user != null ? user.getFullName() : "Unknown";

            String journalTitle = journalRepository
                    .findById(sub.getJournalId())
                    .map(Journal::getTitle)
                    .orElse("Unknown Journal");

            Long receiptId = receiptRepository
                    .findTopByPayment_Subscription_IdOrderByGeneratedAtDesc(sub.getId())
                    .map(Receipt::getReceiptId)
                    .orElse(null);

            return new SubscriptionResponse(
                    sub.getId(),
                    sub.getUserId(),
                    sub.getJournalId(),
                    journalTitle,
                    sub.getStatus().name(),
                    sub.getQuantity(),
                    sub.getYears(),
                    sub.getStartDate(),
                    sub.getEndDate(),
                    receiptId,
                    userName   // ✅ NEW
            );

        }).toList();
    }

    // =====================================================
    // CREATE SUBSCRIPTION (CALENDAR BASED)
    // =====================================================

    public Subscription createSubscription(Long userId, Integer quantity, Integer years) {

        Subscription subscription = new Subscription();

        subscription.setUserId(userId);
        subscription.setQuantity(quantity);
        subscription.setYears(years);
        subscription.setStatus(Subscription.SubscriptionStatus.INACTIVE);

        LocalDate today = LocalDate.now();

        // ✅ FIXED: Jan–Dec logic
        LocalDate startDate = LocalDate.of(today.getYear(), 1, 1);

        LocalDate endDate = LocalDate.of(
                today.getYear() + years - 1,
                12,
                31
        );

        subscription.setStartDate(startDate);
        subscription.setEndDate(endDate);

        return subscriptionRepository.save(subscription);
    }

    // =====================================================
    // CANCEL SUBSCRIPTION + REFUND
    // =====================================================
    public void cancelSubscription(Long subscriptionId) {

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        // ✅ THEN fetch payment
        Payment payment = paymentRepository
                .findTopBySubscription_Id(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // =====================================================
        // ✅ HANDLE ALREADY REFUNDED (FIXED)
        // =====================================================
        if (payment.getStatus() == Payment.PaymentStatus.REFUNDED) {

            subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(subscription);

            return; // ✅ idempotent exit
        }



        if (subscription.getStatus() != Subscription.SubscriptionStatus.ACTIVE) {
            throw new RuntimeException("Subscription is not active");
        }

        if (payment.getRazorpayPaymentId() == null) {
            throw new RuntimeException("Missing Razorpay payment ID");
        }

        // =====================================================
        // ✅ BEST: COUNT REMAINING MONTHS FROM DISPATCH TABLE
        // =====================================================

        long remainingMonths =
                dispatchRepository.countBySubscription_IdAndStatus(subscriptionId, DispatchStatus.PENDING);

        if (remainingMonths <= 0) {
            subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(subscription);
            return;
        }

        // =====================================================
        // 💰 REFUND CALCULATION (YEARLY → MONTHLY)
        // =====================================================

        double pricePerMonthPerUnit =
                payment.getAmount() /
                        (subscription.getQuantity() * subscription.getYears() * 12);

        double refundAmount =
                pricePerMonthPerUnit *
                        subscription.getQuantity() *
                        remainingMonths;

        refundAmount = Math.round(refundAmount * 100.0) / 100.0;

        // =====================================================
        // 💳 REFUND VIA RAZORPAY
        // =====================================================

        try {

            razorpayService.refundPayment(
                    payment.getRazorpayPaymentId(),
                    refundAmount
            );

            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            paymentRepository.save(payment);

        } catch (Exception e) {

            if (e.getMessage() != null &&
                    e.getMessage().contains("fully refunded already")) {

                payment.setStatus(Payment.PaymentStatus.REFUNDED);
                paymentRepository.save(payment);

            } else {
                throw new RuntimeException("Refund failed: " + e.getMessage());
            }
        }

        // =====================================================
        // 🚚 CANCEL ALL FUTURE (PENDING) DISPATCHES
        // =====================================================

        List<Dispatch> dispatches =
                dispatchRepository.findBySubscription_Id(subscriptionId);

        for (Dispatch d : dispatches) {
            if (d.getStatus() == DispatchStatus.PENDING) {
                d.setStatus(DispatchStatus.CANCELLED);
            }
        }

        dispatchRepository.saveAll(dispatches);

        // =====================================================
        // ❌ CANCEL SUBSCRIPTION
        // =====================================================

        subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
        subscriptionRepository.save(subscription);
    }

    // =====================================================
    // RENEW SUBSCRIPTION (CALENDAR BASED)
    // =====================================================

    public Long renewSubscription(Long oldSubscriptionId, Integer years) {

        Subscription oldSub = subscriptionRepository.findById(oldSubscriptionId)
                .orElseThrow(() -> new RuntimeException("Old subscription not found"));

        if (oldSub.getStatus() == Subscription.SubscriptionStatus.ACTIVE &&
                LocalDate.now().isBefore(oldSub.getEndDate())) {
            throw new RuntimeException("Subscription is still active");
        }

        Subscription newSub = new Subscription();

        newSub.setUserId(oldSub.getUserId());
        newSub.setJournalId(oldSub.getJournalId());
        newSub.setQuantity(oldSub.getQuantity());
        newSub.setYears(years);

        LocalDate today = LocalDate.now();

        // ✅ FIXED: Jan–Dec renewal
        LocalDate startDate = LocalDate.of(today.getYear(), 1, 1);
        LocalDate endDate = LocalDate.of(
                today.getYear() + years - 1,
                12,
                31
        );

        newSub.setStartDate(startDate);
        newSub.setEndDate(endDate);
        newSub.setStatus(Subscription.SubscriptionStatus.INACTIVE);

        Subscription saved = subscriptionRepository.save(newSub);

        return saved.getId();
    }
}