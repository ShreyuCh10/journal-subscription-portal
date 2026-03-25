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

    // ================= STEP 1: CREATE ORDER =================
    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody CheckoutRequest request) throws Exception {

        // ❗ IMPORTANT: ideally calculate amount in backend
        Double amount = request.getAmount();

        Order order = razorpayService.createOrder(amount); // ✅ clean

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("key", razorpayKeyId);

        return ResponseEntity.ok(response);
    }

    // ================= STEP 2: VERIFY PAYMENT =================
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody CheckoutRequest request) {

        try {

            boolean isValid = razorpayService.verifySignature(
                    request.getRazorpay_order_id(),
                    request.getRazorpay_payment_id(),
                    request.getRazorpay_signature()
            );

            if (!isValid) {
                return ResponseEntity.badRequest()
                        .body("Invalid payment signature");
            }

            CheckoutResponse response =
                    checkoutService.processSuccessfulPayment(
                            request,
                            request.getRazorpay_payment_id(),
                            request.getRazorpay_order_id()
                    );

            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "receiptId", response.getReceiptId()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Payment verification failed");
        }
    }
}