package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ClerkService clerkService;

    public UserService(UserRepository userRepository, ClerkService clerkService) {
        this.userRepository = userRepository;
        this.clerkService = clerkService;
    }

    public User syncUser(String clerkUserId, String email, String name) {

        return userRepository.findByClerkUserId(clerkUserId)
                .map(user -> {

                    if (user.getEmail() == null) {
                        user.setEmail(email);
                    }

                    if (user.getFullName() == null) {
                        user.setFullName(name);
                    }

                    return userRepository.save(user);
                })
                .orElseGet(() -> {

                    User user = new User();

                    user.setClerkUserId(clerkUserId);
                    user.setEmail(email);
                    user.setFullName(name);
                    user.setSubscribed(false);
                    user.setInterested(false);

                    return userRepository.save(user);
                });
    }
    public User getByClerkId(String clerkUserId) {
        return userRepository.findByClerkUserId(clerkUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    public User createUser(String clerkUserId, String email, String fullName) {

        userRepository.findByClerkUserId(clerkUserId).ifPresent(u -> {
            throw new RuntimeException("User already exists");
        });

        User user = new User();

        user.setClerkUserId(clerkUserId);
        user.setEmail(email);
        user.setFullName(fullName);   // now valid
        user.setSubscribed(false);
        user.setInterested(false);

        return userRepository.save(user);
    }

    public List<User> findAllInterested() {
        return userRepository.findByInterestedTrue();
    }

    public List<User> findAllNotSubscribed() {
        return userRepository.findBySubscribedFalse();
    }
    public List<User> findAll() {
        return userRepository.findAll();
    }
}
