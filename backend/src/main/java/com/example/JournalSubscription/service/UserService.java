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

    public User syncUser(String clerkUserId) {

        return userRepository.findByClerkUserId(clerkUserId)
                .orElseGet(() -> {

                    Map userData = clerkService.getUser(clerkUserId);

                    String firstName = (String) userData.get("first_name");
                    String lastName = (String) userData.get("last_name");

                    String fullName = (firstName != null ? firstName : "") +
                            " " +
                            (lastName != null ? lastName : "");

                    List<Map> emails =
                            (List<Map>) userData.get("email_addresses");

                    String email =
                            (String) emails.get(0).get("email_address");

                    User newUser = new User();

                    newUser.setClerkUserId(clerkUserId);
                    newUser.setEmail(email);
                    newUser.setFullName(fullName);
                    newUser.setSubscribed(false);
                    newUser.setInterested(false);

                    return userRepository.save(newUser);
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
