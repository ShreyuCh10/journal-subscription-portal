package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Journal;
import com.example.JournalSubscription.repository.JournalRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
public class JournalService {

    private final JournalRepository journalRepository;

    // Use absolute path to avoid saving in /target folder
    private final String UPLOAD_DIR =
            "C:/Users/Rohit/IdeaProjects/Journal_Portal/backend/uploads/journals/";

    public JournalService(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    // CREATE
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

            String fileName =
                    System.currentTimeMillis() + "_" + image.getOriginalFilename();

            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath();

            System.out.println("Saving image to: " + uploadPath);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(
                    image.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            System.out.println("File saved: " + filePath);

            journal.setImageUrl("/uploads/journals/" + fileName);
        }

        return journalRepository.save(journal);
    }

    // READ ALL
    public List<Journal> findAll() {
        return journalRepository.findAll();
    }

    // READ BY ID
    public Journal findById(Long id) {
        return journalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Journal not found with id: " + id));
    }

    // UPDATE
    public Journal update(
            Long id,
            String title,
            Double price,
            String description,
            String publisher,
            MultipartFile image
    ) throws IOException {

        Journal existingJournal = findById(id);

        existingJournal.setTitle(title);
        existingJournal.setPrice(price);
        existingJournal.setDescription(description);
        existingJournal.setPublisher(publisher);

        if (image != null && !image.isEmpty()) {

            String fileName =
                    System.currentTimeMillis() + "_" + image.getOriginalFilename();

            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(
                    image.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            existingJournal.setImageUrl("/uploads/journals/" + fileName);
        }

        return journalRepository.save(existingJournal);
    }

    // DELETE
    public void delete(Long id) {
        journalRepository.deleteById(id);
    }
}