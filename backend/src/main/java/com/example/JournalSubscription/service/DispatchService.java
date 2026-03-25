package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.DispatchDTO;
import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.DispatchRepository;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DispatchService {

    private final DispatchRepository dispatchRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final EmailService emailService;
    private final CurrentUserService currentUserService;

    public DispatchService(DispatchRepository dispatchRepository,
                           SubscriptionRepository subscriptionRepository,
                           EmailService emailService,
                           CurrentUserService currentUserService) {
        this.dispatchRepository = dispatchRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.emailService = emailService;
        this.currentUserService = currentUserService;
    }

    // ================= ALL =================
    public List<DispatchDTO> getAllDispatches() {
        return dispatchRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ================= UPDATE =================
    public DispatchDTO updateStatus(UUID id, String status) {

        Dispatch dispatch = dispatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispatch not found"));

        DispatchStatus newStatus = DispatchStatus.valueOf(status.toUpperCase());
        dispatch.setStatus(newStatus);

        if (newStatus == DispatchStatus.SHIPPED) {
            dispatch.setDispatchDate(LocalDateTime.now());

            if (dispatch.getTrackingNumber() == null) {
                dispatch.setTrackingNumber("TRK-" + UUID.randomUUID());
            }

        } else if (newStatus == DispatchStatus.DELIVERED) {
            dispatch.setDeliveryDate(LocalDateTime.now());
        }

        Dispatch saved = dispatchRepository.save(dispatch);

        // ================= EMAIL =================
        if (newStatus == DispatchStatus.SHIPPED) {
            try {
                String trackingLink =
                        "https://www.delhivery.com/track/package/" +
                                saved.getTrackingNumber();

                emailService.sendEmail(
                        saved.getUser().getEmail(),
                        "Your Journal has been Shipped 📦",
                        "Hello " + saved.getUser().getFullName() + ",\n\n" +
                                "Your journal has been shipped.\n\n" +
                                "Journal: " + saved.getJournal().getTitle() + "\n" +
                                "Month: " + saved.getMonth() + "/" + saved.getYear() + "\n\n" +
                                "Tracking ID: " + saved.getTrackingNumber() + "\n" +
                                "Track here: " + trackingLink + "\n\n" +
                                "Thank you!"
                );

            } catch (Exception e) {
                System.out.println("Dispatch email failed");
            }
        }

        return toDTO(saved);
    }

    // ================= CREATE =================
    public DispatchDTO createDispatch(UUID subscriptionId) {

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        Dispatch dispatch = new Dispatch();

        dispatch.setSubscription(subscription);
        dispatch.setUser(subscription.getUser());     // ✅ no DB call
        dispatch.setJournal(subscription.getJournal()); // ✅ no DB call
        dispatch.setStatus(DispatchStatus.PENDING);

        dispatchRepository.save(dispatch);

        return toDTO(dispatch);
    }

    // ================= USER DISPATCHES =================
    public List<DispatchDTO> getMyDispatches() {

        User user = currentUserService.getCurrentUser();

        return dispatchRepository.findByUser_Id(user.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ================= COUNT =================
    public long countByStatus(DispatchStatus status) {
        return dispatchRepository.countByStatus(status);
    }

    // ================= DTO =================
    private DispatchDTO toDTO(Dispatch dispatch) {

        DispatchDTO dto = new DispatchDTO();

        dto.setId(dispatch.getId());
        dto.setStatus(dispatch.getStatus().name());
        dto.setDispatchDate(dispatch.getDispatchDate());
        dto.setDeliveryDate(dispatch.getDeliveryDate());
        dto.setTrackingNumber(dispatch.getTrackingNumber());
        dto.setCreatedAt(dispatch.getCreatedAt());

        dto.setSubscriptionId(dispatch.getSubscription().getId());

        dto.setUserName(dispatch.getUser().getFullName());
        dto.setUserEmail(dispatch.getUser().getEmail());

        dto.setJournalTitle(dispatch.getJournal().getTitle());

        dto.setMonth(dispatch.getMonth());
        dto.setYear(dispatch.getYear());
        dto.setQuantity(dispatch.getSubscription().getQuantity());

        return dto;
    }
}