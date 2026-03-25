package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.SubscriptionResponse;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final ReceiptRepository receiptRepository;
    private final DispatchRepository dispatchRepository;
    private final RazorpayService razorpayService;
    private final CurrentUserService currentUserService;

    public SubscriptionService(
            SubscriptionRepository subscriptionRepository,
            PaymentRepository paymentRepository,
            ReceiptRepository receiptRepository,
            DispatchRepository dispatchRepository,
            RazorpayService razorpayService,
            CurrentUserService currentUserService
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.paymentRepository = paymentRepository;
        this.receiptRepository = receiptRepository;
        this.dispatchRepository = dispatchRepository;
        this.razorpayService = razorpayService;
        this.currentUserService = currentUserService;
    }

    // ================= FIND BY ID =================
    public Subscription findById(UUID id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
    }

    // ================= ALL SUBSCRIPTIONS =================
    public List<SubscriptionResponse> findAll() {

        return subscriptionRepository.findAll().stream().map(sub -> {

            String userName = sub.getUser().getFullName();
            String journalTitle = sub.getJournal().getTitle();

            UUID receiptId = receiptRepository
                    .findTopByPayment_Subscription_IdOrderByGeneratedAtDesc(sub.getId())
                    .map(Receipt::getId)
                    .orElse(null);

            return new SubscriptionResponse(
                    sub.getId(),
                    sub.getUser().getId(),
                    sub.getJournal().getId(),
                    journalTitle,
                    sub.getStatus().name(),
                    sub.getQuantity(),
                    sub.getYears(),
                    sub.getStartDate(),
                    sub.getEndDate(),
                    receiptId,
                    userName
            );

        }).toList();
    }

    // ================= CURRENT USER SUBSCRIPTIONS =================
    public List<SubscriptionResponse> getMySubscriptions() {

        User currentUser = currentUserService.getCurrentUser();

        return subscriptionRepository
                .findByUser_Id(currentUser.getId())
                .stream()
                .map(sub -> {

                    String journalTitle = sub.getJournal().getTitle();

                    UUID receiptId = receiptRepository
                            .findTopByPayment_Subscription_IdOrderByGeneratedAtDesc(sub.getId())
                            .map(Receipt::getId)
                            .orElse(null);

                    return new SubscriptionResponse(
                            sub.getId(),
                            sub.getUser().getId(),
                            sub.getJournal().getId(),
                            journalTitle,
                            sub.getStatus().name(),
                            sub.getQuantity(),
                            sub.getYears(),
                            sub.getStartDate(),
                            sub.getEndDate(),
                            receiptId,
                            currentUser.getFullName()
                    );

                }).toList();
    }

    // ================= CREATE =================
    public Subscription createSubscription(Journal journal, Integer quantity, Integer years) {

        User user = currentUserService.getCurrentUser();

        Subscription subscription = new Subscription();

        subscription.setUser(user);
        subscription.setJournal(journal);
        subscription.setQuantity(quantity);
        subscription.setYears(years);
        subscription.setStatus(Subscription.SubscriptionStatus.INACTIVE);

        LocalDate today = LocalDate.now();

        LocalDate startDate = LocalDate.of(today.getYear(), 1, 1);
        LocalDate endDate = LocalDate.of(today.getYear() + years - 1, 12, 31);

        subscription.setStartDate(startDate);
        subscription.setEndDate(endDate);

        return subscriptionRepository.save(subscription);
    }

    // ================= CANCEL =================
    public void cancelSubscription(UUID subscriptionId) {

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        Payment payment = paymentRepository
                .findTopBySubscription_Id(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == Payment.PaymentStatus.REFUNDED) {
            subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(subscription);
            return;
        }

        long remainingMonths =
                dispatchRepository.countBySubscription_IdAndStatus(subscriptionId, DispatchStatus.PENDING);

        if (remainingMonths <= 0) {
            subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(subscription);
            return;
        }

        double pricePerMonth =
                payment.getAmount() /
                        (subscription.getQuantity() * subscription.getYears() * 12);

        double refundAmount =
                pricePerMonth * subscription.getQuantity() * remainingMonths;

        refundAmount = Math.round(refundAmount * 100.0) / 100.0;

        try {
            razorpayService.refundPayment(
                    payment.getRazorpayPaymentId(),
                    refundAmount
            );
        } catch (Exception e) {
            throw new RuntimeException("Refund failed: " + e.getMessage());
        }

        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        paymentRepository.save(payment);

        // cancel dispatch
        List<Dispatch> dispatches =
                dispatchRepository.findBySubscription_Id(subscriptionId);

        dispatches.forEach(d -> {
            if (d.getStatus() == DispatchStatus.PENDING) {
                d.setStatus(DispatchStatus.CANCELLED);
            }
        });

        dispatchRepository.saveAll(dispatches);

        subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
        subscriptionRepository.save(subscription);
    }

    // ================= RENEW =================
    public UUID renewSubscription(UUID oldId, Integer years) {

        Subscription oldSub = subscriptionRepository.findById(oldId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        Subscription newSub = new Subscription();

        newSub.setUser(oldSub.getUser());
        newSub.setJournal(oldSub.getJournal());
        newSub.setQuantity(oldSub.getQuantity());
        newSub.setYears(years);

        LocalDate today = LocalDate.now();

        newSub.setStartDate(LocalDate.of(today.getYear(), 1, 1));
        newSub.setEndDate(LocalDate.of(today.getYear() + years - 1, 12, 31));

        newSub.setStatus(Subscription.SubscriptionStatus.INACTIVE);

        return subscriptionRepository.save(newSub).getId();
    }
}