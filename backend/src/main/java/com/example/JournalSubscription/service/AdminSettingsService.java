package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.AdminSettings;
import com.example.JournalSubscription.repository.AdminSettingsRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminSettingsService {

    private final AdminSettingsRepository settingsRepository;

    public AdminSettingsService(AdminSettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public Map<String, String> getAllSettings() {
        List<AdminSettings> all = settingsRepository.findAll();
        Map<String, String> result = new HashMap<>();
        for (AdminSettings s : all) {
            result.put(s.getSettingKey(), s.getSettingValue());
        }
        return result;
    }

    public Map<String, String> updateSettings(Map<String, String> settings) {
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            AdminSettings existing = settingsRepository
                    .findBySettingKey(entry.getKey())
                    .orElse(new AdminSettings());

            existing.setSettingKey(entry.getKey());
            existing.setSettingValue(entry.getValue());
            settingsRepository.save(existing);
        }
        return getAllSettings();
    }
}
