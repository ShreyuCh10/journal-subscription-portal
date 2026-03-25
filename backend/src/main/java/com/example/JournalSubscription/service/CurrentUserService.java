package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

    @Service
    public class CurrentUserService {

        private final UserRepository userRepository;

        public CurrentUserService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }

        public User getCurrentUser() {

            Jwt jwt = (Jwt) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            String clerkUserId = jwt.getSubject();

            return userRepository.findByClerkUserId(clerkUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
    }

