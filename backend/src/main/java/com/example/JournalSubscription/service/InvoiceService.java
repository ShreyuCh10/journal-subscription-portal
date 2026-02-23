package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Invoice;
import com.example.JournalSubscription.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    // ✅ Get All
    public List<Invoice> findAll() {
        return invoiceRepository.findAll();
    }

    public Invoice findById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    // ✅ Save
    public Invoice save(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    // ✅ Delete
    public void delete(Long id) {
        invoiceRepository.deleteById(id);
    }
}