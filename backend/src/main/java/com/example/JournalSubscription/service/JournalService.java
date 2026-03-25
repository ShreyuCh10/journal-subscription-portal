package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Journal;
import com.example.JournalSubscription.repository.JournalRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class JournalService {

    private final JournalRepository journalRepository;

    // ✅ Correct path definition
    private final Path UPLOAD_PATH =
            Paths.get(System.getProperty("user.dir"), "uploads", "journals");

    public JournalService(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    // ================= CREATE =================
    public Journal save(
            String title,
            Double price,
            String description,
            String publisher,
            MultipartFile image
    ) throws IOException {

        Journal journal = new Journal();

        journal.setTitle(title);
        journal.setPrice(price);
        journal.setDescription(description);
        journal.setPublisher(publisher);

        if (image != null && !image.isEmpty()) {
            journal.setImageUrl(saveImage(image));
        }

        return journalRepository.save(journal);
    }

    // ================= READ ALL =================
    public List<Journal> findAll() {
        return journalRepository.findAll();
    }

    // ================= READ BY ID =================
    public Journal findById(UUID id) {
        return journalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Journal not found with id: " + id));
    }

    // ================= UPDATE =================
    public Journal update(
            UUID id,
            String title,
            Double price,
            String description,
            String publisher,
            MultipartFile image
    ) throws IOException {

        Journal existing = findById(id);

        existing.setTitle(title);
        existing.setPrice(price);
        existing.setDescription(description);
        existing.setPublisher(publisher);

        if (image != null && !image.isEmpty()) {
            existing.setImageUrl(saveImage(image));
        }

        return journalRepository.save(existing);
    }

    // ================= DELETE =================
    public void delete(UUID id) {
        journalRepository.deleteById(id);
    }

    // ================= HELPER =================
    private String saveImage(MultipartFile image) throws IOException {

        String fileName =
                System.currentTimeMillis() + "_" + image.getOriginalFilename();

        // ✅ Ensure directory exists
        if (!Files.exists(UPLOAD_PATH)) {
            Files.createDirectories(UPLOAD_PATH);
        }

        Path filePath = UPLOAD_PATH.resolve(fileName);

        Files.copy(
                image.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/journals/" + fileName;
    }
}