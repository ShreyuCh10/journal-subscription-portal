package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.dto.*;
import com.example.JournalSubscription.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ================= STATS =================
    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        return adminService.getStats();
    }

    // ================= CHART DATA =================
    @GetMapping("/charts")
    public Map<String, Object> getCharts() {
        return adminService.getCharts();
    }

    // ================= RECENT USERS =================
    @GetMapping("/recent-users")
    public List<UserDto> getRecentUsers() {
        return adminService.getRecentUsers();
    }

    // ================= RECENT PAYMENTS =================
    @GetMapping("/recent-payments")
    public List<PaymentDto> getRecentPayments() {
        return adminService.getRecentPayments();
    }
}