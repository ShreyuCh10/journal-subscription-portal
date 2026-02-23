package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.EmailNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmailNotificationRepository extends JpaRepository<EmailNotification, Long> {

    List<EmailNotification> findBySentFalse();
}

