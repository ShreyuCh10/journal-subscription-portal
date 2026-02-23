package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🔐 Auto-create user if not exists
    public User syncUser(String clerkUserId, String email) {

        return userRepository.findByClerkUserId(clerkUserId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setClerkUserId(clerkUserId);
                    newUser.setEmail(email);
                    newUser.setSubscribed(false);
                    newUser.setInterested(false);
                    return userRepository.save(newUser);
                });
    }

    public User getByClerkId(String clerkUserId) {
        return userRepository.findByClerkUserId(clerkUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> findAllInterested() {
        return userRepository.findByInterestedTrue();
    }

    public List<User> findAllNotSubscribed() {
        return userRepository.findBySubscribedFalse();
    }
}
