package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.dto.CreateUserRequest;
import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.UserRepository;
import com.example.JournalSubscription.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService,
                          UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // 🔐 Get current logged-in user
    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal Jwt jwt) {

        System.out.println("JWT CLAIMS = " + jwt.getClaims());

        return userService.syncUser(jwt); // ✅ CORRECT
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
        return userService.createUser(
                request.getClerkUserId(),
                request.getEmail(),
                request.getFullName()
        );
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    @PostMapping("/upload-profile")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Jwt jwt) throws IOException {

        String clerkUserId = jwt.getSubject();

        User user = userRepository.findByClerkUserId(clerkUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path uploadPath = Paths.get(System.getProperty("user.dir"), "uploads", "profile");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);

        Files.write(filePath, file.getBytes());

        user.setProfilePicture("/uploads/profile/" + fileName);

        userRepository.save(user);

        return ResponseEntity.ok(user.getProfilePicture());
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestBody User updatedUser,
            @AuthenticationPrincipal Jwt jwt) {

        String clerkUserId = jwt.getSubject();

        User user = userRepository.findByClerkUserId(clerkUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(updatedUser.getFullName());
        user.setBillingAddress(updatedUser.getBillingAddress());

        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}