package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.entity.DispatchStatus;
import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.repository.DispatchRepository;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DispatchService {

    private final DispatchRepository dispatchRepository;
    private final DelhiveryService delhiveryService;
    private final SubscriptionRepository subscriptionRepository;

    public DispatchService(
            DispatchRepository dispatchRepository,
            DelhiveryService delhiveryService,
            SubscriptionRepository subscriptionRepository

    ) {
        this.dispatchRepository = dispatchRepository;
        this.delhiveryService = delhiveryService;
        this.subscriptionRepository= subscriptionRepository;
    }

    // Create dispatch when order is ready to ship
    public Dispatch createDispatch(Long subscriptionId){

        System.out.println("CREATE DISPATCH CALLED");

        LocalDate today = LocalDate.now();

        // Prevent duplicate dispatch in same month
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);

        boolean alreadyDispatched =
                dispatchRepository.existsBySubscriptionIdAndDispatchDateBetween(
                        subscriptionId,
                        startOfMonth,
                        endOfMonth
                );

        if (alreadyDispatched) {

            System.out.println("Dispatch already created this month");

            return null;
        }

        Dispatch dispatch = new Dispatch();

        dispatch.setSubscriptionId(subscriptionId);
        dispatch.setCourier("Delhivery");
        dispatch.setDispatchDate(today);

        // Sandbox tracking number
        String waybill = "TEST-" + System.currentTimeMillis();

        dispatch.setTrackingNumber(waybill);
        dispatch.setStatus(DispatchStatus.PENDING);

        // Optional Delhivery sandbox API call
        try {

            String payload =
                    "format=json&data={\"shipments\":[{" +
                            "\"name\":\"Test User\"," +
                            "\"add\":\"Delhi Address\"," +
                            "\"pin\":\"110001\"," +
                            "\"city\":\"New Delhi\"," +
                            "\"state\":\"Delhi\"," +
                            "\"phone\":\"9999999999\"," +
                            "\"order\":\"SUB-"+subscriptionId+"\"," +
                            "\"payment_mode\":\"Prepaid\"," +
                            "\"products_desc\":\"Journal Subscription\"," +
                            "\"weight\":0.5," +
                            "\"pickup_location\":{\"name\":\"TestWarehouse\"}" +
                            "}]}";

            String response = delhiveryService.createShipment(payload);

            System.out.println("Delhivery response:");
            System.out.println(response);

        } catch (Exception e) {

            System.out.println("Delhivery sandbox call failed (safe to ignore)");
        }

        return dispatchRepository.save(dispatch);
    }

    // Get all dispatch records
    public List<Dispatch> getAllDispatch() {
        return dispatchRepository.findAll();
    }

    // Update dispatch status
    public Dispatch updateStatus(Long dispatchId, DispatchStatus status) {

        Dispatch dispatch = dispatchRepository.findById(dispatchId)
                .orElseThrow(() -> new RuntimeException("Dispatch not found"));

        dispatch.setStatus(status);

        if (status == DispatchStatus.DELIVERED) {
            dispatch.setDeliveryDate(LocalDate.now());
        }

        return dispatchRepository.save(dispatch);
    }
    public List<Dispatch> getUserDispatches(Long userId){

        List<Subscription> subscriptions =
                subscriptionRepository.findByUserId(userId);

        List<Long> subscriptionIds = subscriptions
                .stream()
                .map(Subscription::getId)
                .toList();

        return dispatchRepository.findBySubscriptionIdIn(subscriptionIds);
    }
}