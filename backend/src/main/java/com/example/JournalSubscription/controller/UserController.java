package com.example.JournalSubscription.controller;
import com.example.JournalSubscription.dto.CreateUserRequest;
import jakarta.validation.Valid;
import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 🔐 Get current logged-in user
    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal Jwt jwt) {

        String clerkUserId = jwt.getSubject();   // Clerk user ID
        String email = jwt.getClaim("email");
        System.out.println(jwt.getClaims());

        return userService.syncUser(clerkUserId, email);
    }

    @GetMapping("/interested")
    public List<User> getInterestedUsers() {
        return userService.findAllInterested();
    }

    @GetMapping("/not-subscribed")
    public List<User> getNotSubscribedUsers() {
        return userService.findAllNotSubscribed();
    }

    @PostMapping
    public User createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request.getClerkUserId(), request.getEmail());
    }
    @GetMapping
    public List<User> getAllUsers() {   // ✅ ADD THIS
        return userService.findAll();
    }
}