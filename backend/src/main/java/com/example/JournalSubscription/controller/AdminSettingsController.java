package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.service.AdminSettingsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
public class AdminSettingsController {

    private final AdminSettingsService settingsService;

    public AdminSettingsController(AdminSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public Map<String, String> getAll() {
        return settingsService.getAllSettings();
    }

    @PutMapping
    public Map<String, String> update(@RequestBody Map<String, String> settings) {
        return settingsService.updateSettings(settings);
    }
}
