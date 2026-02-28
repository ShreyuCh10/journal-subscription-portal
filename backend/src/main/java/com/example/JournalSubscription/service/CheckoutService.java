package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.CheckoutRequest;
import com.example.JournalSubscription.dto.CheckoutResponse;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@Transactional
public class CheckoutService {

    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final ReceiptRepository receiptRepository;
    private final JournalRepository journalRepository;

    public CheckoutService(
            SubscriptionRepository subscriptionRepository,
            InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository,
            ReceiptRepository receiptRepository,
            JournalRepository journalRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.receiptRepository = receiptRepository;
        this.journalRepository = journalRepository;
    }

    public CheckoutResponse processSuccessfulPayment(
            CheckoutRequest request,
            String razorpayPaymentId,
            String razorpayOrderId
    ) {

        // 1️⃣ Validate Journal
        Journal journal = journalRepository.findById(request.getJournalId())
                .orElseThrow(() -> new RuntimeException("Journal not found"));

        double calculatedAmount = journal.getPrice() * request.getMonths();

        if (Double.compare(calculatedAmount, request.getAmount()) != 0) {
            throw new RuntimeException("Amount mismatch");
        }

        Subscription subscription;

        // 🔁 RENEWAL FLOW
        if (request.getRenewalOfSubscriptionId() != null) {

            Subscription oldSubscription = subscriptionRepository
                    .findById(request.getRenewalOfSubscriptionId())
                    .orElseThrow(() -> new RuntimeException("Old subscription not found"));

            // 🔐 Security check: ensure same user
            if (!oldSubscription.getUserId().equals(request.getUserId())) {
                throw new RuntimeException("Unauthorized renewal attempt");
            }

            subscription = new Subscription();
            subscription.setUserId(oldSubscription.getUserId());
            subscription.setJournalId(oldSubscription.getJournalId());
            subscription.setMonths(request.getMonths());

            // 🧠 Smart Renewal Date Logic
            LocalDate startDate;

            if (LocalDate.now().isAfter(oldSubscription.getEndDate())) {
                // expired → start from today
                startDate = LocalDate.now();
            } else {
                // active → extend from end date
                startDate = oldSubscription.getEndDate();
            }

            subscription.setStartDate(startDate);
            subscription.setEndDate(startDate.plusMonths(request.getMonths()));

        } else {
            // 🆕 NEW SUBSCRIPTION FLOW

            // Prevent duplicate active subscription
            subscriptionRepository.findByUserId(request.getUserId())
                    .stream()
                    .filter(sub -> sub.getJournalId().equals(request.getJournalId())
                            && sub.getStatus() == Subscription.SubscriptionStatus.ACTIVE
                            && LocalDate.now().isBefore(sub.getEndDate()))
                    .findFirst()
                    .ifPresent(sub -> {
                        throw new RuntimeException("Active subscription already exists.");
                    });

            subscription = new Subscription();
            subscription.setUserId(request.getUserId());
            subscription.setJournalId(request.getJournalId());
            subscription.setMonths(request.getMonths());

            LocalDate startDate = LocalDate.now();
            subscription.setStartDate(startDate);
            subscription.setEndDate(startDate.plusMonths(request.getMonths()));
        }

        subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);

        Subscription savedSub = subscriptionRepository.save(subscription);

        // 3️⃣ Create Invoice
        Invoice invoice = new Invoice();
        invoice.setSubscriptionId(savedSub.getId());
        invoice.setAmount(calculatedAmount);
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
        invoice.setIssuedDate(LocalDateTime.now());

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // 4️⃣ Create Payment
        Payment payment = new Payment();
        payment.setSubscription(savedSub);
        payment.setInvoice(savedInvoice);
        payment.setAmount(calculatedAmount);
        payment.setPaymentMethod("RAZORPAY");
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpayOrderId(razorpayOrderId);
        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        // 5️⃣ Generate Receipt
        Receipt receipt = new Receipt();
        receipt.setPayment(savedPayment);
        receipt.setReceiptNumber("RCPT-" + System.currentTimeMillis());
        receipt.setGeneratedAt(LocalDateTime.now());

        Receipt savedReceipt = receiptRepository.save(receipt);

        return new CheckoutResponse(
                "SUCCESS",
                savedReceipt.getReceiptId()
        );
    }
}