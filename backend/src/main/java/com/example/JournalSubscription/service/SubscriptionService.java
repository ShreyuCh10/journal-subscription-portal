package com.example.JournalSubscription.service;
import com.example.JournalSubscription.repository.PaymentRepository;
import com.example.JournalSubscription.repository.ReceiptRepository;
import com.example.JournalSubscription.dto.SubscriptionResponse;
import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.repository.JournalRepository;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import com.example.JournalSubscription.entity.Payment;
import com.example.JournalSubscription.repository.PaymentRepository;
import java.util.List;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final JournalRepository journalRepository;
    private final ReceiptRepository receiptRepository;
    private final PaymentRepository paymentRepository;
    private final RazorpayService razorpayService;

    public SubscriptionService(
            SubscriptionRepository subscriptionRepository,
            JournalRepository journalRepository,
            ReceiptRepository receiptRepository,
            PaymentRepository paymentRepository,
            RazorpayService razorpayService) {

        this.subscriptionRepository = subscriptionRepository;
        this.journalRepository = journalRepository;
        this.receiptRepository = receiptRepository;
        this.paymentRepository = paymentRepository;
        this.razorpayService = razorpayService;
    }
    public Subscription findById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
    }

    public List<Subscription> findAll() {
        return subscriptionRepository.findAll();
    }

    public List<SubscriptionResponse> findByUserId(Long userId) {

        List<Subscription> subscriptions = subscriptionRepository.findByUserId(userId);

        return subscriptions.stream().map(sub -> {

            String journalTitle = journalRepository.findById(sub.getJournalId())
                    .map(j -> j.getTitle())
                    .orElse("Unknown Journal");

            Long receiptId = receiptRepository
                    .findByPayment_Subscription_Id(sub.getId())
                    .map(r -> r.getReceiptId())
                    .orElse(null);

            return new SubscriptionResponse(
                    sub.getId(),
                    journalTitle,
                    sub.getStatus().name(),
                    sub.getMonths(),
                    sub.getStartDate(),
                    sub.getEndDate(),
                    receiptId
            );

        }).toList();
    }

    public Subscription createSubscription(Long userId, Integer months) {
        Subscription subscription = new Subscription();
        subscription.setUserId(userId);
        subscription.setMonths(months);
        subscription.setStatus(Subscription.SubscriptionStatus.INACTIVE);

        return subscriptionRepository.save(subscription);
    }



    public void cancelSubscription(Long subscriptionId) {

        Payment payment = paymentRepository
                .findTopBySubscription_Id(subscriptionId)
                .orElse(null);

        if (payment == null) {
            throw new RuntimeException("No payment found for this subscription");
        }

        if (payment.getStatus() == Payment.PaymentStatus.REFUNDED) {
            throw new RuntimeException("Already refunded");
        }

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        if (subscription.getStatus() != Subscription.SubscriptionStatus.ACTIVE) {
            throw new RuntimeException("Subscription is not active");
        }

        // 1️⃣ Get Payment FIRST
        payment = paymentRepository
                .findTopBySubscription_Id(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getRazorpayPaymentId() == null) {
            throw new RuntimeException("Refund failed: Missing Razorpay payment ID");
        }

        if (payment.getStatus() == Payment.PaymentStatus.REFUNDED) {
            throw new RuntimeException("Already refunded");
        }

        System.out.println("Payment ID: " + payment.getRazorpayPaymentId());
        System.out.println("Payment Status: " + payment.getStatus());
        System.out.println("Amount: " + payment.getAmount());

        // 2️⃣ Calculate remaining months
        long remainingMonths = calculateRemainingMonths(subscription);

        if (remainingMonths <= 0) {
            subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(subscription);
            return;
        }

        // 3️⃣ Calculate refund
        double monthlyAmount = payment.getAmount() / subscription.getMonths();
        double refundAmount = monthlyAmount * remainingMonths;

        try {

            razorpayService.refundPayment(
                    payment.getRazorpayPaymentId(),
                    refundAmount
            );

            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            paymentRepository.save(payment);

        } catch (Exception e) {

            // 🔥 If Razorpay says already refunded
            if (e.getMessage() != null &&
                    e.getMessage().contains("fully refunded already")) {

                System.out.println("Payment already refunded in Razorpay. Syncing DB...");

                payment.setStatus(Payment.PaymentStatus.REFUNDED);
                paymentRepository.save(payment);

            } else {
                throw new RuntimeException("Refund failed: " + e.getMessage());
            }
        }

        // 6️⃣ Update subscription
        subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
        subscriptionRepository.save(subscription);
    }


    private long calculateRemainingMonths(Subscription subscription) {

        LocalDate today = LocalDate.now();
        LocalDate endDate = subscription.getEndDate();

        if (!today.isBefore(endDate)) {
            return 0;
        }

        return ChronoUnit.MONTHS.between(
                today.withDayOfMonth(1),
                endDate.withDayOfMonth(1)
        );
    }

    public Long renewSubscription(Long oldSubscriptionId, Integer months) {

        Subscription oldSubscription = subscriptionRepository.findById(oldSubscriptionId)
                .orElseThrow(() -> new RuntimeException("Old subscription not found"));

        // Optional: prevent renewal if still active
        if (oldSubscription.getStatus() == Subscription.SubscriptionStatus.ACTIVE &&
                LocalDate.now().isBefore(oldSubscription.getEndDate())) {
            throw new RuntimeException("Subscription is still active. Cannot renew yet.");
        }

        // 1️⃣ Create NEW subscription record
        Subscription newSubscription = new Subscription();

        newSubscription.setUserId(oldSubscription.getUserId());
        newSubscription.setJournalId(oldSubscription.getJournalId());
        newSubscription.setMonths(months);

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(months);

        newSubscription.setStartDate(startDate);
        newSubscription.setEndDate(endDate);
        newSubscription.setStatus(Subscription.SubscriptionStatus.INACTIVE);

        Subscription savedNewSub = subscriptionRepository.save(newSubscription);

        return savedNewSub.getId();
    }
}