package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.entity.DispatchStatus;
import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.UserRepository;
import com.example.JournalSubscription.service.DispatchService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/dispatch")
public class DispatchController {

    private final DispatchService dispatchService;
    private final UserRepository UserRepository;

    public DispatchController(DispatchService dispatchService, UserRepository userRepository) {
        this.dispatchService = dispatchService;
        UserRepository = userRepository;
    }

    // CREATE DISPATCH
    @PostMapping("/{subscriptionId}")
    public Dispatch createDispatch(@PathVariable Long subscriptionId) {
        return dispatchService.createDispatch(subscriptionId);
    }

    // GET ALL
    @GetMapping
    public List<Dispatch> getAllDispatch() {
        return dispatchService.getAllDispatch();
    }
    // UPDATE STATUS
    @PutMapping("/{dispatchId}")
    public Dispatch updateDispatchStatus(
            @PathVariable Long dispatchId,
            @RequestParam DispatchStatus status
    ) {
        return dispatchService.updateStatus(dispatchId, status);
    }

    @GetMapping("/my-shipments")
    public List<Dispatch> getUserShipments(@AuthenticationPrincipal Jwt jwt){

        String clerkUserId = jwt.getSubject();

        User user = UserRepository.findByClerkUserId(clerkUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return dispatchService.getUserDispatches(user.getId());
    }
}