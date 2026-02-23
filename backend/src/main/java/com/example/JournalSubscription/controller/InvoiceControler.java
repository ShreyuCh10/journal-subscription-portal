package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Invoice;
import com.example.JournalSubscription.service.InvoiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceControler {

    private final InvoiceService invoiceService;

    public InvoiceControler(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public List<Invoice> getAll() {
        return invoiceService.findAll();
    }

    @GetMapping("/{id}")
    public Invoice getById(@PathVariable Long id) {
        return invoiceService.findById(id);
    }
}
