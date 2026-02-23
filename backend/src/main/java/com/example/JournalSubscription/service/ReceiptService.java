package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Receipt;
import com.example.JournalSubscription.repository.ReceiptRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;

    public ReceiptService(ReceiptRepository receiptRepository) {
        this.receiptRepository = receiptRepository;
    }

    public List<Receipt> findAll() {
        return receiptRepository.findAll();
    }

    public Receipt findById(Long id) {
        return receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));
    }

    public Receipt findByPaymentId(Long paymentId) {
        return receiptRepository.findByPayment_PaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException(
                        "Receipt not found for payment id: " + paymentId));
    }

    public Receipt save(Receipt receipt) {
        return receiptRepository.save(receipt);
    }

    public void delete(Long id) {
        receiptRepository.deleteById(id);
    }
}