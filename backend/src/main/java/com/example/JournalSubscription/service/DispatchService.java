package com.example.JournalSubscription.service;

import com.example.JournalSubscription.dto.DispatchDTO;
import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.entity.Journal;
import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.DispatchRepository;
import com.example.JournalSubscription.repository.JournalRepository;
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

    public DispatchService(DispatchRepository dispatchRepository,
                           UserRepository userRepository,
                           JournalRepository journalRepository) {
        this.dispatchRepository = dispatchRepository;
        this.userRepository = userRepository;
        this.journalRepository = journalRepository;
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

        Dispatch.DispatchStatus newStatus = Dispatch.DispatchStatus.valueOf(status);
        dispatch.setStatus(newStatus);

        if (newStatus == Dispatch.DispatchStatus.SHIPPED) {
            dispatch.setDispatchDate(LocalDateTime.now());
        } else if (newStatus == Dispatch.DispatchStatus.DELIVERED) {
            dispatch.setDeliveryDate(LocalDateTime.now());
        }

        dispatchRepository.save(dispatch);
        return toDTO(dispatch);
    }

    public DispatchDTO createDispatch(Long subscriptionId, Long userId, Long journalId) {
        Dispatch dispatch = new Dispatch();
        dispatch.setSubscriptionId(subscriptionId);
        dispatch.setUserId(userId);
        dispatch.setJournalId(journalId);
        dispatch.setStatus(Dispatch.DispatchStatus.PENDING);
        dispatchRepository.save(dispatch);
        return toDTO(dispatch);
    }

    public long countByStatus(Dispatch.DispatchStatus status) {
        return dispatchRepository.countByStatus(status);
    }

    private DispatchDTO toDTO(Dispatch dispatch) {
        DispatchDTO dto = new DispatchDTO();
        dto.setId(dispatch.getId());
        dto.setSubscriptionId(dispatch.getSubscriptionId());
        dto.setStatus(dispatch.getStatus().name());
        dto.setDispatchDate(dispatch.getDispatchDate());
        dto.setDeliveryDate(dispatch.getDeliveryDate());
        dto.setTrackingNumber(dispatch.getTrackingNumber());
        dto.setCreatedAt(dispatch.getCreatedAt());

        // Resolve user name & email
        userRepository.findById(dispatch.getUserId()).ifPresent(user -> {
            dto.setUserName(user.getFullName() != null ? user.getFullName() : user.getEmail());
            dto.setUserEmail(user.getEmail());
        });

        // Resolve journal title
        journalRepository.findById(dispatch.getJournalId()).ifPresent(journal -> {
            dto.setJournalTitle(journal.getTitle());
        });

        return dto;
    }
}
