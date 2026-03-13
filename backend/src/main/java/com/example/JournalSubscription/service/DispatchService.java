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

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DispatchService {

    private final DispatchRepository dispatchRepository;
    private final UserRepository userRepository;
    private final JournalRepository journalRepository;
    private final SubscriptionRepository subscriptionRepository;

    public DispatchService(DispatchRepository dispatchRepository,
                           UserRepository userRepository,
                           JournalRepository journalRepository,
                           SubscriptionRepository subscriptionRepository) {
        this.dispatchRepository = dispatchRepository;
        this.userRepository = userRepository;
        this.journalRepository = journalRepository;
        this.subscriptionRepository = subscriptionRepository;
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

        if (newStatus == DispatchStatus.SHIPPED) {
            dispatch.setDispatchDate(LocalDateTime.now());
        } else if (newStatus == DispatchStatus.DELIVERED) {
            dispatch.setDeliveryDate(LocalDateTime.now());
        }

        dispatchRepository.save(dispatch);

        return toDTO(dispatch);
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
        dispatch.setTrackingNumber("TRK-" + System.currentTimeMillis());

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
        dto.setDispatchDate(dispatch.getDispatchDate());
        dto.setDeliveryDate(dispatch.getDeliveryDate());
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

        return dto;
    }
}