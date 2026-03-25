package com.example.JournalSubscription.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.List;

@Service
public class ClerkService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${clerk.secret.key}")
    private String CLERK_SECRET_KEY;// 🔑 put your clerk secret key

    public Map getUser(String clerkUserId) {

        String url = "https://api.clerk.dev/v1/users/" + clerkUserId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + CLERK_SECRET_KEY);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        return response.getBody();
    }
}
