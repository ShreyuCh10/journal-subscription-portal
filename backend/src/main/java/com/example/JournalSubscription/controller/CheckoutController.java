package com.example.JournalSubscription.controller;

import com.razorpay.Order;
import com.example.JournalSubscription.service.CheckoutService;
import com.example.JournalSubscription.service.RazorpayService;
import com.example.JournalSubscription.dto.CheckoutRequest;
import com.example.JournalSubscription.dto.CheckoutResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final RazorpayService razorpayService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public CheckoutController(CheckoutService checkoutService,
                              RazorpayService razorpayService) {
        this.checkoutService = checkoutService;
        this.razorpayService = razorpayService;
    }

    // STEP 1: Create Razorpay Order
    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody CheckoutRequest request) throws Exception {

        Order order = razorpayService.createOrder(request.getAmount());

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("key", razorpayKeyId);

        return ResponseEntity.ok(response);
    }

    // STEP 2: Verify Payment + Save Payment + Create Subscription
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody CheckoutRequest request) {

        try {

            boolean isValid = razorpayService.verifySignature(
                    request.getRazorpay_order_id(),
                    request.getRazorpay_payment_id(),
                    request.getRazorpay_signature()
            );

            if (!isValid) {
                return ResponseEntity.badRequest().body("Invalid payment signature");
            }

            // ✅ Save payment & create subscription AFTER successful verification
            CheckoutResponse checkoutResponse =
                    checkoutService.processSuccessfulPayment(
                            request,
                            request.getRazorpay_payment_id(),
                            request.getRazorpay_order_id()
                    );

            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("receiptId", checkoutResponse.getReceiptId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Payment verification failed");
        }
    }
}
