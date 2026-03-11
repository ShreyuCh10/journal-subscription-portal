package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.entity.DispatchStatus;
import com.example.JournalSubscription.repository.DispatchRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/webhooks/delhivery")
public class DelhiveryWebhookController {

    private final DispatchRepository dispatchRepository;

    public DelhiveryWebhookController(DispatchRepository dispatchRepository) {
        this.dispatchRepository = dispatchRepository;
    }

    @PostMapping
    public String receiveWebhook(@RequestBody String payload) {

        System.out.println("Delhivery webhook received:");
        System.out.println(payload);

        // Example parsing (simple version)
        if (payload.contains("Delivered")) {

            String waybill = extractWaybill(payload);

            Optional<Dispatch> dispatch =
                    dispatchRepository.findByTrackingNumber(waybill);

            dispatch.ifPresent(d -> {
                d.setStatus(DispatchStatus.DELIVERED);
                dispatchRepository.save(d);
            });

        }

        return "Webhook received";
    }

    private String extractWaybill(String payload){

        // temporary parsing
        int index = payload.indexOf("waybill");
        if(index==-1) return null;

        return payload.substring(index+10,index+22);
    }
}
