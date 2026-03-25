package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Invoice;
import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.entity.InvoiceStatus;
import com.example.JournalSubscription.repository.InvoiceRepository;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final SubscriptionRepository subscriptionRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          SubscriptionRepository subscriptionRepository) {
        this.invoiceRepository = invoiceRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    // ================= CREATE =================
    public Invoice createInvoiceForSubscription(UUID subscriptionId, Double amount) {

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        Invoice invoice = new Invoice();

        // ✅ RELATION (IMPORTANT)
        invoice.setSubscription(subscription);

        invoice.setAmount(amount);
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
        invoice.setStatus(InvoiceStatus.GENERATED);
        invoice.setIssuedDate(LocalDateTime.now());

        return invoiceRepository.save(invoice);
    }

    // ================= FIND =================
    public Invoice findById(UUID id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    // ================= SAVE =================
    public Invoice save(Invoice invoice) {

        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
        }

        if (invoice.getStatus() == null) {
            invoice.setStatus(InvoiceStatus.GENERATED);
        }

        if (invoice.getIssuedDate() == null) {
            invoice.setIssuedDate(LocalDateTime.now());
        }

        return invoiceRepository.save(invoice);
    }
}