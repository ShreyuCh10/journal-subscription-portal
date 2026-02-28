package com.example.JournalSubscription.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.razorpay.Utils;
@Service
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public Order createOrder(Double amount) throws RazorpayException {
        if (amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }

        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); // Razorpay uses paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_" + System.currentTimeMillis());

        return razorpay.orders.create(orderRequest);
    }

    public boolean verifySignature(String orderId, String paymentId, String signature)
            throws RazorpayException {

        String payload = orderId + "|" + paymentId;

        return Utils.verifySignature(payload, signature, keySecret);
    }

    public void refundPayment(String razorpayPaymentId, Double refundAmount) throws RazorpayException {

        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        JSONObject refundRequest = new JSONObject();
        refundRequest.put("amount", refundAmount * 100); // convert to paise

        razorpay.payments.refund(razorpayPaymentId, refundRequest);
    }
}