package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.PaymentResponse;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CurrentUserService currentUserService;

    public PaymentService(PaymentRepository paymentRepository,
                          CurrentUserService currentUserService) {
        this.paymentRepository = paymentRepository;
        this.currentUserService = currentUserService;
    }

    // ================= USER PAYMENTS =================
    public List<PaymentResponse> getUserPayments() {

        User currentUser = currentUserService.getCurrentUser();

        List<Payment> payments =
                paymentRepository.findBySubscription_User_Id(currentUser.getId());

        return payments.stream().map(payment -> {

            PaymentResponse res = new PaymentResponse();

            res.setId(payment.getId());
            res.setAmount(payment.getAmount());
            res.setStatus(payment.getStatus().name());
            res.setPaymentDate(payment.getPaymentDate());
            res.setRazorpayPaymentId(payment.getRazorpayPaymentId());

            res.setJournalTitle(
                    payment.getSubscription().getJournal().getTitle()
            );

            return res;

        }).toList();
    }

    // ================= ADMIN =================
    public List<PaymentResponse> getAllPayments() {

        return paymentRepository.findAll().stream().map(payment -> {

            PaymentResponse res = new PaymentResponse();

            res.setId(payment.getId());
            res.setAmount(payment.getAmount());
            res.setStatus(payment.getStatus().name());
            res.setPaymentDate(payment.getPaymentDate());
            res.setRazorpayPaymentId(payment.getRazorpayPaymentId());

            res.setJournalTitle(
                    payment.getSubscription().getJournal().getTitle()
            );

            res.setUserName(
                    payment.getSubscription().getUser().getFullName()
            );

            return res;

        }).toList();
    }
}