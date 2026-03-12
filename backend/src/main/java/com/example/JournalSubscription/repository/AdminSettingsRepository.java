package com.example.JournalSubscription.repository;

import com.example.JournalSubscription.entity.AdminSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminSettingsRepository extends JpaRepository<AdminSettings, Long> {

    Optional<AdminSettings> findBySettingKey(String settingKey);
}
