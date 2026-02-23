package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.entity.Journal;
import com.example.JournalSubscription.service.JournalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journals")
public class JournalController {

    private final JournalService journalService;

    public JournalController(JournalService journalService) {
        this.journalService = journalService;
    }

    @PostMapping
    public Journal createJournal(@RequestBody Journal journal) {
        return journalService.save(journal);
    }

    @GetMapping
    public List<Journal> getAllJournals() {
        return journalService.findAll();
    }

    @GetMapping("/{id}")
    public Journal getJournalById(@PathVariable Long id) {
        return journalService.findById(id);
    }

    @PutMapping("/{id}")
    public Journal updateJournal(@PathVariable Long id,
                                 @RequestBody Journal journal) {
        return journalService.update(id, journal);
    }

    @DeleteMapping("/{id}")
    public void deleteJournal(@PathVariable Long id) {
        journalService.delete(id);
    }
}
