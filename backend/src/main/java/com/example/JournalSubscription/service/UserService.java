package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.UserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ClerkService clerkService;

    public UserService(UserRepository userRepository, ClerkService clerkService) {
        this.userRepository = userRepository;
        this.clerkService = clerkService;
    }

    // 🔥 SYNC USER (PRODUCTION SAFE)
    @Transactional
    public User syncUser(Jwt jwt) {

        String clerkId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");   // ✅ FIXED
        String name = jwt.getClaimAsString("name");     // ✅ FIXED

        // 1️⃣ Check by clerkId
        return userRepository.findByClerkUserId(clerkId)
                .orElseGet(() -> {

                    // 2️⃣ Check by email
                    return userRepository.findByEmail(email)
                            .map(user -> {
                                // ✅ Link clerkId if different
                                if (!clerkId.equals(user.getClerkUserId())) {
                                    user.setClerkUserId(clerkId);
                                    return userRepository.save(user);
                                }
                                return user;
                            })
                            .orElseGet(() -> {
                                // 3️⃣ Create new user
                                User newUser = new User();
                                newUser.setClerkUserId(clerkId);
                                newUser.setEmail(email);
                                newUser.setFullName(name);
                                newUser.setSubscribed(false);
                                newUser.setInterested(false);

                                return userRepository.save(newUser);
                            });
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
        user.setFullName(fullName);
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