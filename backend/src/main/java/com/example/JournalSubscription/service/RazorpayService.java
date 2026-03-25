package com.example.JournalSubscription.service;

import com.razorpay.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private RazorpayClient razorpay;

    @PostConstruct
    public void init() throws RazorpayException {
        this.razorpay = new RazorpayClient(keyId, keySecret);
    }

    // ================= CREATE ORDER =================
    public Order createOrder(Double amount) throws RazorpayException {

        if (amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }

        int amountInPaise = (int) Math.round(amount * 100);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");

        // ✅ Simple receipt (no subscription dependency)
        orderRequest.put("receipt", "order_" + System.currentTimeMillis());

        return razorpay.orders.create(orderRequest);
    }

    // ================= VERIFY =================
    public boolean verifySignature(String orderId, String paymentId, String signature)
            throws RazorpayException {

        String payload = orderId + "|" + paymentId;

        return Utils.verifySignature(payload, signature, keySecret);
    }

    // ================= REFUND =================
    public void refundPayment(String razorpayPaymentId, Double refundAmount)
            throws RazorpayException {

        int amountInPaise = (int) Math.round(refundAmount * 100);

        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", amountInPaise);

        razorpay.payments.refund(razorpayPaymentId, refundRequest);
    }
}