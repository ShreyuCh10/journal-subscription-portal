package com.example.JournalSubscription.entity;
import lombok.Data;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true)
    private String clerkUserId;

    @Column(unique = true)
    private String email;

    private Boolean subscribed = false;
    private Boolean interested = false;

    private String fullName;
    private String billingAddress;
    private String profilePicture;

    private LocalDateTime createdAt;
}