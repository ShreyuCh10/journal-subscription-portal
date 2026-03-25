package com.example.JournalSubscription.dto;

import java.util.UUID;

public class UserDto {

    private UUID id;
    private String name;
    private String email;
    private String status;

    public UserDto(UUID id, String name, String email, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.status = status;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getStatus() { return status; }
}