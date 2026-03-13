package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.entity.DispatchStatus;
import com.example.JournalSubscription.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DispatchRepository extends JpaRepository<Dispatch, Long> {

    List<Dispatch> findByStatus(DispatchStatus status);

    List<Dispatch> findAllByOrderByCreatedAtDesc();

    long countByStatus(DispatchStatus status);

    Optional<Dispatch> findByTrackingNumber(String trackingNumber);

    List<Dispatch> findByUser(User user);
}
