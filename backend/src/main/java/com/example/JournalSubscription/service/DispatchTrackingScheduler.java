package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.entity.DispatchStatus;
import com.example.JournalSubscription.repository.DispatchRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DispatchTrackingScheduler {

    private final DispatchRepository dispatchRepository;
    private final DelhiveryService delhiveryService;

    public DispatchTrackingScheduler(
            DispatchRepository dispatchRepository,
            DelhiveryService delhiveryService
    ) {
        this.dispatchRepository = dispatchRepository;
        this.delhiveryService = delhiveryService;
    }

    // Runs every 30 minutes
    @Scheduled(fixedRate = 1800000)
    public void updateTrackingStatus(){

        List<Dispatch> dispatches = dispatchRepository.findAll();

        for(Dispatch dispatch : dispatches){

            if (dispatch.getTrackingNumber() == null ||
                    dispatch.getStatus() == DispatchStatus.CANCELLED ||
                    dispatch.getStatus() == DispatchStatus.PENDING) {
                continue;
            }

            try {

                String response =
                        delhiveryService.trackShipment(
                                dispatch.getTrackingNumber()
                        );

                System.out.println(response);

                if(response.contains("Delivered")){

                    dispatch.setStatus(DispatchStatus.DELIVERED);
                    dispatchRepository.save(dispatch);

                }

                else if(response.contains("In Transit")){

                    dispatch.setStatus(DispatchStatus.SHIPPED);
                    dispatchRepository.save(dispatch);

                }

            }catch(Exception e){

                System.out.println("Tracking update failed");

            }

        }

    }
}