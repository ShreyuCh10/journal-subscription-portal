package com.example.JournalSubscription.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DelhiveryService {

    @Value("${delhivery.api.key}")
    private String apiKey;

    @Value("${delhivery.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String createShipment(String payload){

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Token " + apiKey);
        headers.setContentType(MediaType.TEXT_PLAIN);

        HttpEntity<String> request =
                new HttpEntity<>(payload, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        baseUrl + "/api/cmu/create.json",
                        request,
                        String.class
                );

        return response.getBody();
    }

    public String trackShipment(String waybill){

        HttpHeaders headers = new HttpHeaders();

        headers.set("Authorization","Token " + apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = baseUrl + "/api/v1/packages/json/?waybill=" + waybill;

        ResponseEntity<String> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        String.class
                );

        return response.getBody();
    }
}