package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.EmailNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EmailNotificationRepository extends JpaRepository<EmailNotification, UUID> {

    List<EmailNotification> findBySentFalse();
}

