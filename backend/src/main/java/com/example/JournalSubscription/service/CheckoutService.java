package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.CheckoutRequest;
import com.example.JournalSubscription.dto.CheckoutResponse;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class CheckoutService {

    private final SubscriptionRepository subscriptionRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final ReceiptRepository receiptRepository;
    private final JournalRepository journalRepository;
    private final DispatchRepository dispatchRepository;
    private final EmailService emailService;
    private final CurrentUserService currentUserService;

    public CheckoutService(
            SubscriptionRepository subscriptionRepository,
            InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository,
            ReceiptRepository receiptRepository,
            JournalRepository journalRepository,
            DispatchRepository dispatchRepository,
            EmailService emailService,
            CurrentUserService currentUserService
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.receiptRepository = receiptRepository;
        this.journalRepository = journalRepository;
        this.dispatchRepository = dispatchRepository;
        this.emailService = emailService;
        this.currentUserService = currentUserService;
    }

    public CheckoutResponse processSuccessfulPayment(
            CheckoutRequest request,
            String razorpayPaymentId,
            String razorpayOrderId
    ) {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cart empty");
        }

        User user = currentUserService.getCurrentUser(); // 🔐 secure

        double calculatedAmount = 0;

        // ================= AMOUNT =================
        for (var item : request.getItems()) {

            Journal journal = journalRepository.findById(item.getJournalId())
                    .orElseThrow(() -> new RuntimeException("Journal not found"));

            calculatedAmount += journal.getPrice()
                    * item.getQuantity()
                    * item.getYears();
        }

        if (Double.compare(calculatedAmount, request.getAmount()) != 0) {
            throw new RuntimeException("Amount mismatch");
        }

        // ================= ADDRESS =================
        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getMobile());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        LocalDate today = LocalDate.now();
        List<Subscription> savedSubs = new ArrayList<>();

        // ================= SUBSCRIPTIONS =================
        for (var item : request.getItems()) {

            Journal journal = journalRepository.findById(item.getJournalId())
                    .orElseThrow(() -> new RuntimeException("Journal not found"));

            Subscription sub = new Subscription();

            sub.setUser(user);
            sub.setJournal(journal);
            sub.setQuantity(item.getQuantity());
            sub.setYears(item.getYears());
            sub.setShippingAddress(address);
            sub.setStatus(Subscription.SubscriptionStatus.ACTIVE);

            LocalDate startDate = LocalDate.of(today.getYear(), 1, 1);
            LocalDate endDate = LocalDate.of(
                    today.getYear() + item.getYears() - 1,
                    12,
                    31
            );

            sub.setStartDate(startDate);
            sub.setEndDate(endDate);

            Subscription savedSub = subscriptionRepository.save(sub);
            savedSubs.add(savedSub);

            // ================= DISPATCH =================
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

            dispatchRepository.saveAll(dispatchList);

            // ================= EMAIL =================
            try {
                emailService.sendEmail(
                        user.getEmail(),
                        "Subscription Activated 🎉",
                        "Journal: " + journal.getTitle() +
                                "\nValid till: " + endDate
                );
            } catch (Exception ignored) {}
        }

        // ================= INVOICE =================
        Invoice invoice = new Invoice();
        invoice.setSubscription(savedSubs.get(0)); // ✅ relation
        invoice.setAmount(calculatedAmount);
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setInvoiceNumber("INV-" + UUID.randomUUID());
        invoice.setIssuedDate(LocalDateTime.now());

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // ================= PAYMENT =================
        Payment payment = new Payment();
        payment.setSubscription(savedSubs.get(0));
        payment.setInvoice(savedInvoice);
        payment.setAmount(calculatedAmount);
        payment.setPaymentMethod("RAZORPAY");
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpayOrderId(razorpayOrderId);

        Payment savedPayment = paymentRepository.save(payment);

        // ================= RECEIPT =================
        Receipt receipt = new Receipt();
        receipt.setPayment(savedPayment);
        receipt.setReceiptNumber("RCPT-" + UUID.randomUUID());

        Receipt savedReceipt = receiptRepository.save(receipt);

        return new CheckoutResponse("SUCCESS", savedReceipt.getId());
    }
}