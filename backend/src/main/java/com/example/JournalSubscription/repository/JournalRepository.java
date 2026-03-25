package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Journal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JournalRepository extends JpaRepository<Journal, UUID> {


    List<Journal> findByPublisher(String publisher);
}