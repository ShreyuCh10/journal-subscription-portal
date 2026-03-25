package com.example.JournalSubscription.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "address")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    private String fullName;
    private String phone;
    private String street;
    private String city;
    private String state;
    private String pincode;

    // 🔥 Proper relation with User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}