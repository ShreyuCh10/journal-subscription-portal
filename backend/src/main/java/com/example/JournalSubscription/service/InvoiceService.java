package com.example.JournalSubscription.service;
import java.time.LocalDateTime;
import com.example.JournalSubscription.entity.Invoice;
import com.example.JournalSubscription.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import com.example.JournalSubscription.entity.InvoiceStatus;
@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    public Invoice createInvoiceForSubscription(Long subscriptionId, Double amount) {

        Invoice invoice = new Invoice();
        invoice.setSubscriptionId(subscriptionId);   // ✅ VERY IMPORTANT
        invoice.setAmount(amount);
        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
        invoice.setStatus(InvoiceStatus.GENERATED);
        invoice.setIssuedDate(LocalDateTime.now());

        return invoiceRepository.save(invoice);
    }



    public Invoice findById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }
    public Invoice save(Invoice invoice) {
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
        }

        if (invoice.getStatus() == null) {
            invoice.setStatus(InvoiceStatus.GENERATED);  // ✅ enum, not string
        }

        if (invoice.getIssuedDate() == null) {
            invoice.setIssuedDate(LocalDateTime.now());
        }

        return invoiceRepository.save(invoice);
    }
}