package com.example.JournalSubscription.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CreateUserRequest {

    private String clerkUserId;
    private String email;
    private String fullName;   // ✅ ADD

    public String getClerkUserId() { return clerkUserId; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
}
