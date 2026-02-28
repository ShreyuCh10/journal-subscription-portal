package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Invoice;
import com.example.JournalSubscription.service.InvoiceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceControler {

    private final InvoiceService invoiceService;

    public InvoiceControler(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // ✅ CREATE INVOICE (Checkout)
    @PostMapping("/subscription/{subscriptionId}")
    public Invoice createInvoice(@PathVariable Long subscriptionId, @RequestParam Double amount) {
        return invoiceService.createInvoiceForSubscription(subscriptionId, amount);
    }

    // ✅ GET INVOICE BY ID
    @GetMapping("/{id}")
    public Invoice getInvoiceById(@PathVariable Long id) {
        return invoiceService.findById(id);
    }
}