package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.DispatchDTO;
import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.entity.DispatchStatus;
import com.example.JournalSubscription.entity.Journal;
import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.DispatchRepository;
import com.example.JournalSubscription.repository.JournalRepository;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import com.example.JournalSubscription.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.example.JournalSubscription.service.EmailService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DispatchService {

    private final DispatchRepository dispatchRepository;
    private final UserRepository userRepository;
    private final JournalRepository journalRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final EmailService emailService;

    public DispatchService(DispatchRepository dispatchRepository,
                           UserRepository userRepository,
                           JournalRepository journalRepository,
                           SubscriptionRepository subscriptionRepository,
                           EmailService emailService) {
        this.dispatchRepository = dispatchRepository;
        this.userRepository = userRepository;
        this.journalRepository = journalRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.emailService= emailService;
    }

    public List<DispatchDTO> getAllDispatches() {
        return dispatchRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DispatchDTO updateStatus(Long id, String status) {

        Dispatch dispatch = dispatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispatch not found"));

        DispatchStatus newStatus = DispatchStatus.valueOf(status.toUpperCase());

        dispatch.setStatus(newStatus);

        // =====================================================
        // 🚚 STATUS LOGIC
        // =====================================================

        if (newStatus == DispatchStatus.SHIPPED) {

            dispatch.setDispatchDate(LocalDateTime.now());

            // ✅ Generate tracking only once
            if (dispatch.getTrackingNumber() == null) {
                dispatch.setTrackingNumber("TRK-" + System.currentTimeMillis());
            }

        } else if (newStatus == DispatchStatus.DELIVERED) {

            dispatch.setDeliveryDate(LocalDateTime.now());
        }

        // ✅ Save first
        Dispatch saved = dispatchRepository.save(dispatch);

        // =====================================================
        // 📧 SEND EMAIL
        // =====================================================
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

        // =====================================================
        // ✅ RETURN DTO
        // =====================================================
        return toDTO(saved);
    }

    public DispatchDTO createDispatch(Long subscriptionId, Long userId, Long journalId) {

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Journal journal = journalRepository.findById(journalId)
                .orElseThrow(() -> new RuntimeException("Journal not found"));

        Dispatch dispatch = new Dispatch();
        dispatch.setSubscription(subscription);
        dispatch.setUser(user);
        dispatch.setJournal(journal);
        dispatch.setStatus(DispatchStatus.PENDING);

        dispatchRepository.save(dispatch);

        return toDTO(dispatch);
    }

    public long countByStatus(DispatchStatus status) {
        return dispatchRepository.countByStatus(status);
    }

    public List<DispatchDTO> getUserDispatches(String email) {
        User user = userRepository.findByClerkUserId(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return dispatchRepository.findByUser(user)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }



    private DispatchDTO toDTO(Dispatch dispatch) {

        DispatchDTO dto = new DispatchDTO();

        dto.setId(dispatch.getId());
        dto.setStatus(dispatch.getStatus().name());
        dto.setDispatchDate(
                dispatch.getDispatchDate() != null ? dispatch.getDispatchDate() : null
        );

        dto.setDeliveryDate(
                dispatch.getDeliveryDate() != null ? dispatch.getDeliveryDate() : null
        );
        dto.setTrackingNumber(dispatch.getTrackingNumber());
        dto.setCreatedAt(dispatch.getCreatedAt());

        if (dispatch.getSubscription() != null) {
            dto.setSubscriptionId(dispatch.getSubscription().getId());
        }

        if (dispatch.getUser() != null) {
            dto.setUserName(
                    dispatch.getUser().getFullName() != null
                            ? dispatch.getUser().getFullName()
                            : dispatch.getUser().getEmail()
            );
            dto.setUserEmail(dispatch.getUser().getEmail());
        }

        if (dispatch.getJournal() != null) {
            dto.setJournalTitle(dispatch.getJournal().getTitle());
        }
        dto.setJournalTitle(dispatch.getJournal().getTitle());
        dto.setMonth(dispatch.getMonth());
        dto.setYear(dispatch.getYear());
        dto.setQuantity(dispatch.getSubscription().getQuantity());

        return dto;
    }
}