package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Journal;
import com.example.JournalSubscription.service.JournalService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/journals")
public class JournalController {

    private final JournalService journalService;

    public JournalController(JournalService journalService) {
        this.journalService = journalService;
    }

    // CREATE JOURNAL
    @PostMapping
    public Journal createJournal(

            @RequestParam String title,
            @RequestParam Double price,
            @RequestParam String description,
            @RequestParam String publisher,
            @RequestParam(required = false) MultipartFile image

    ) throws IOException {

        return journalService.save(
                title,
                price,
                description,
                publisher,
                image
        );
    }

    // GET ALL
    @GetMapping
    public List<Journal> getAllJournals() {
        return journalService.findAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Journal getJournalById(@PathVariable Long id) {
        return journalService.findById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Journal updateJournal(

            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam Double price,
            @RequestParam String description,
            @RequestParam String publisher,
            @RequestParam(required = false) MultipartFile image

    ) throws IOException {

        return journalService.update(
                id,
                title,
                price,
                description,
                publisher,
                image
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteJournal(@PathVariable Long id) {
        journalService.delete(id);
    }
}