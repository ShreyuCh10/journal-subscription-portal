package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.Dispatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DispatchRepository extends JpaRepository<Dispatch, Long> {

    List<Dispatch> findByStatus(Dispatch.DispatchStatus status);

    List<Dispatch> findAllByOrderByCreatedAtDesc();

    long countByStatus(Dispatch.DispatchStatus status);
}
