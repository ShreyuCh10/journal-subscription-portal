package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Journal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JournalRepository extends JpaRepository<Journal, Long> {


    List<Journal> findByPublisher(String publisher);
}