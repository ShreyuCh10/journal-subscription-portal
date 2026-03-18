package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.CheckoutRequest;
import com.example.JournalSubscription.dto.CheckoutResponse;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CheckoutService {

    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final ReceiptRepository receiptRepository;
    private final JournalRepository journalRepository;
    private final DispatchRepository dispatchRepository;
    private final UserRepository userRepository;
    private final EmailService emailService; // ✅ added

    public CheckoutService(
            SubscriptionRepository subscriptionRepository,
            InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository,
            ReceiptRepository receiptRepository,
            JournalRepository journalRepository,
            DispatchRepository dispatchRepository,
            UserRepository userRepository,
            EmailService emailService // ✅ added
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.receiptRepository = receiptRepository;
        this.journalRepository = journalRepository;
        this.dispatchRepository = dispatchRepository;
        this.userRepository = userRepository;
        this.emailService = emailService; // ✅ added
    }

    public CheckoutResponse processSuccessfulPayment(
            CheckoutRequest request,
            String razorpayPaymentId,
            String razorpayOrderId
    ) {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cart items are empty");
        }

        double calculatedAmount = 0;

        // =====================================================
        // 🧮 CALCULATE AMOUNT
        // =====================================================
        for (var item : request.getItems()) {

            Journal journal = journalRepository.findById(item.getJournalId())
                    .orElseThrow(() -> new RuntimeException("Journal not found"));

            calculatedAmount +=
                    journal.getPrice() * item.getQuantity() * item.getYears();
        }

        if (Double.compare(calculatedAmount, request.getAmount()) != 0) {
            throw new RuntimeException("Amount mismatch");
        }

        // =====================================================
        // 🏠 ADDRESS
        // =====================================================
        Address address = new Address();
        address.setUserId(request.getUserId());
        address.setFullName(request.getFullName());
        address.setPhone(request.getMobile());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        List<Subscription> savedSubscriptions = new ArrayList<>();

        // =====================================================
        // 📦 CREATE SUBSCRIPTIONS
        // =====================================================
        for (var item : request.getItems()) {

            Journal journal = journalRepository.findById(item.getJournalId())
                    .orElseThrow(() -> new RuntimeException("Journal not found"));

            Subscription sub = new Subscription();

            sub.setUserId(user.getId());
            sub.setJournalId(journal.getId());
            sub.setQuantity(item.getQuantity());
            sub.setYears(item.getYears());

            LocalDate startDate = LocalDate.of(today.getYear(), 1, 1);
            LocalDate endDate = LocalDate.of(
                    today.getYear() + item.getYears() - 1,
                    12,
                    31
            );

            sub.setStartDate(startDate);
            sub.setEndDate(endDate);
            sub.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            sub.setShippingAddress(address);

            Subscription savedSub = subscriptionRepository.save(sub);
            savedSubscriptions.add(savedSub);

            // =====================================================
            // 📦 CREATE DISPATCHES (BULK SAVE)
            // =====================================================
            List<Dispatch> dispatchList = new ArrayList<>();

            for (int year = startDate.getYear(); year <= endDate.getYear(); year++) {
                for (int month = 1; month <= 12; month++) {

                    Dispatch d = new Dispatch();

                    d.setSubscription(savedSub);
                    d.setUser(user);
                    d.setJournal(journal);
                    d.setYear(year);
                    d.setMonth(month);

                    if (year < today.getYear() ||
                            (year == today.getYear() && month <= today.getMonthValue())) {
                        d.setStatus(DispatchStatus.PACKED);
                    } else {
                        d.setStatus(DispatchStatus.PENDING);
                    }

                    dispatchList.add(d);
                }
            }

            dispatchRepository.saveAll(dispatchList); // ✅ bulk save

            // =====================================================
            // 📧 EMAIL (SAFE)
            // =====================================================
            try {
                emailService.sendEmail(
                        user.getEmail(),
                        "Subscription Activated 🎉",
                        "Journal: " + journal.getTitle() +
                                "\nValid till: " + endDate
                );
            } catch (Exception e) {
                System.out.println("Email failed (subscription)");
            }
        }

        // =====================================================
        // 🧾 INVOICE
        // =====================================================
        Invoice invoice = new Invoice();
        invoice.setSubscriptionId(savedSubscriptions.get(0).getId());
        invoice.setAmount(calculatedAmount);
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
        invoice.setIssuedDate(LocalDateTime.now());

        Invoice savedInvoice = invoiceRepository.save(invoice);

        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "Invoice Generated",
                    "Invoice No: " + invoice.getInvoiceNumber() +
                            "\nAmount: ₹" + calculatedAmount
            );
        } catch (Exception e) {
            System.out.println("Email failed (invoice)");
        }

        // =====================================================
        // 💳 PAYMENT
        // =====================================================
        Payment payment = new Payment();
        payment.setSubscription(savedSubscriptions.get(0));
        payment.setInvoice(savedInvoice);
        payment.setAmount(calculatedAmount);
        payment.setPaymentMethod("RAZORPAY");
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpayOrderId(razorpayOrderId);
        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        // =====================================================
        // 🧾 RECEIPT
        // === ==================================================
        Receipt receipt = new Receipt();
        receipt.setPayment(savedPayment);
        receipt.setReceiptNumber("RCPT-" + System.currentTimeMillis());
        receipt.setGeneratedAt(LocalDateTime.now());

        Receipt savedReceipt = receiptRepository.save(receipt);

        return new CheckoutResponse("SUCCESS", savedReceipt.getReceiptId());
    }
}