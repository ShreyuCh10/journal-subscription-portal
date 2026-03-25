package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.entity.DispatchStatus;
import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DispatchRepository extends JpaRepository<Dispatch, UUID> {

    List<Dispatch> findByStatus(DispatchStatus status);

    List<Dispatch> findAllByOrderByCreatedAtDesc();

    long countByStatus(DispatchStatus status);

    Optional<Dispatch> findByTrackingNumber(String trackingNumber);

    List<Dispatch> findByUser(User user);
    List<Dispatch> findByMonthAndYearAndStatus(
            Integer month,
            Integer year,
            DispatchStatus status
    );

    List<Dispatch> findBySubscription(Subscription subscription);


    List<Dispatch> findBySubscription_Id(UUID subscriptionId);

    long countBySubscription_IdAndStatus(UUID subscriptionId, DispatchStatus status);
    List<Dispatch> findByUser_Id(UUID userId);

}
