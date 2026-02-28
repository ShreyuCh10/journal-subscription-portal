package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Invoice;
import com.example.JournalSubscription.entity.InvoiceStatus;
import com.example.JournalSubscription.entity.Payment;
import com.example.JournalSubscription.entity.Receipt;
import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.repository.InvoiceRepository;
import com.example.JournalSubscription.repository.PaymentRepository;
import com.example.JournalSubscription.repository.ReceiptRepository;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ReceiptRepository receiptRepository;

    public PaymentService(InvoiceRepository invoiceRepository,
                          PaymentRepository paymentRepository,
                          SubscriptionRepository subscriptionRepository,
                          ReceiptRepository receiptRepository) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.receiptRepository = receiptRepository;
    }

    public Payment processPayment(
            Long invoiceId,
            String method,
            String razorpayPaymentId,
            String razorpayOrderId
    ) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        // ✅ Create payment
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setAmount(invoice.getAmount());
        payment.setPaymentMethod(method);
        payment.setStatus(Payment.PaymentStatus.SUCCESS);

        // 🔥 VERY IMPORTANT (Fix)
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpayOrderId(razorpayOrderId);

        Payment savedPayment = paymentRepository.save(payment);

        // ✅ Update invoice
        invoice.setStatus(InvoiceStatus.PAID);
        invoiceRepository.save(invoice);

        // ✅ Activate subscription
        Subscription subscription = subscriptionRepository
                .findById(invoice.getSubscriptionId())
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        payment.setSubscription(subscription);

        paymentRepository.save(payment);

        subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        subscriptionRepository.save(subscription);
        // ✅ Generate receipt
        Receipt receipt = new Receipt();
        receipt.setPayment(savedPayment);
        receipt.setReceiptNumber("REC-" + System.currentTimeMillis());
        receiptRepository.save(receipt);

        return savedPayment;
    }
}