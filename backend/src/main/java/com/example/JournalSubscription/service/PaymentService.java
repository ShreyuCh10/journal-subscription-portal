package com.example.JournalSubscription.service;
import com.example.JournalSubscription.dto.PaymentResponse;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.InvoiceRepository;
import com.example.JournalSubscription.repository.PaymentRepository;
import com.example.JournalSubscription.repository.ReceiptRepository;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import com.example.JournalSubscription.repository.UserRepository;
import com.example.JournalSubscription.repository.JournalRepository;
import java.util.List;

@Service
public class PaymentService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ReceiptRepository receiptRepository;
    private final UserRepository userRepository;
    private final JournalRepository journalRepository;
    private final CurrentUserService currentUserService;

    public PaymentService(
            InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository,
            SubscriptionRepository subscriptionRepository,
            ReceiptRepository receiptRepository,
            UserRepository userRepository,
            JournalRepository journalRepository,
            CurrentUserService currentUserService
    ) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.receiptRepository = receiptRepository;
        this.userRepository = userRepository;
        this.journalRepository = journalRepository;
        this.currentUserService = currentUserService;
    }

    public List<PaymentResponse> getUserPayments() {

        User user = currentUserService.getCurrentUser();

        List<Payment> payments =
                paymentRepository.findBySubscription_UserId(user.getId());

        return payments.stream().map(payment -> {

            PaymentResponse res = new PaymentResponse();

            res.setId(payment.getPaymentId());
            res.setAmount(payment.getAmount());
            res.setStatus(payment.getStatus().name());
            res.setPaymentDate(payment.getPaymentDate());
            res.setRazorpayPaymentId(payment.getRazorpayPaymentId());

            Long journalId = payment.getSubscription().getJournalId();

            Journal journal = journalRepository.findById(journalId)
                    .orElseThrow(() -> new RuntimeException("Journal not found"));

            res.setJournalTitle(journal.getTitle());

            return res;

        }).toList();
    }
    public List<PaymentResponse> getAllPayments() {

        List<Payment> payments = paymentRepository.findAll();

        return payments.stream().map(payment -> {

            PaymentResponse response = new PaymentResponse();

            response.setId(payment.getPaymentId());
            response.setAmount(payment.getAmount());
            response.setStatus(payment.getStatus().name());
            response.setPaymentDate(payment.getPaymentDate());
            response.setRazorpayPaymentId(payment.getRazorpayPaymentId());

            Subscription subscription = payment.getSubscription();

            // ✅ Journal title
            String journalTitle = journalRepository
                    .findById(subscription.getJournalId())
                    .map(j -> j.getTitle())
                    .orElse("Unknown Journal");

            response.setJournalTitle(journalTitle);

            // ✅ User name
            User user = userRepository.findById(subscription.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            response.setUserName(user.getFullName());

            return response;

        }).toList();
    }
}
