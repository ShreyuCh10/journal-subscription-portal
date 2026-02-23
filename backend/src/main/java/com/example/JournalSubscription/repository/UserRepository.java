package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByClerkUserId(String clerkUserId);

    Optional<User> findByEmail(String email);

    List<User> findBySubscribedFalse();

    List<User> findByInterestedTrue();
}


