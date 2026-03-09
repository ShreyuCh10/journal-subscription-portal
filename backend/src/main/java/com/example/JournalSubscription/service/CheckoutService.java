package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.CheckoutRequest;
import com.example.JournalSubscription.dto.CheckoutResponse;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.*;

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

    @Transactional
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

        // =====================================================
        // 🔍 CHECK EXISTING SUBSCRIPTION
        // =====================================================

        Subscription existingSub = subscriptionRepository.findByUserId(request.getUserId())
                .stream()
                .filter(sub -> sub.getJournalId().equals(request.getJournalId())
                        && sub.getStatus() == Subscription.SubscriptionStatus.ACTIVE)
                .findFirst()
                .orElse(null);

        if (existingSub != null) {

            // =====================================================
            // 🔁 EXTEND EXISTING SUBSCRIPTION
            // =====================================================

            LocalDate startDate;

            if (LocalDate.now().isAfter(existingSub.getEndDate())) {
                startDate = LocalDate.now();
            } else {
                startDate = existingSub.getEndDate();
            }

            existingSub.setEndDate(startDate.plusMonths(request.getMonths()));
            existingSub.setMonths(existingSub.getMonths() + request.getMonths());

            subscription = subscriptionRepository.save(existingSub);

        } else {

            // =====================================================
            // 🆕 CREATE NEW SUBSCRIPTION
            // =====================================================

            subscription = new Subscription();

            subscription.setUserId(request.getUserId());
            subscription.setJournalId(request.getJournalId());
            subscription.setMonths(request.getMonths());

            LocalDate startDate = LocalDate.now();

            subscription.setStartDate(startDate);
            subscription.setEndDate(startDate.plusMonths(request.getMonths()));

            subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);

        }

        // =====================================================
        // 🏠 SAVE SHIPPING ADDRESS
        // =====================================================

        Address address = new Address();
        address.setUserId(request.getUserId());   // ⭐ ADD THIS LINE
        address.setFullName(request.getFullName());
        address.setPhone(request.getMobile());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        subscription.setShippingAddress(address);

        Subscription savedSub = subscriptionRepository.save(subscription);

        // =====================================================
        // 🧾 CREATE INVOICE
        // =====================================================

        Invoice invoice = new Invoice();
        invoice.setSubscriptionId(savedSub.getId());
        invoice.setAmount(calculatedAmount);
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
        invoice.setIssuedDate(LocalDateTime.now());

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // =====================================================
        // 💳 CREATE PAYMENT
        // =====================================================

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

        // =====================================================
        // 🧾 GENERATE RECEIPT
        // =====================================================

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