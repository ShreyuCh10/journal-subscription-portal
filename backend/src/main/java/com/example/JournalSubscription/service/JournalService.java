package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Journal;
import com.example.JournalSubscription.repository.JournalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JournalService {

    private final JournalRepository journalRepository;

    public JournalService(JournalRepository journalRepository) {
        this.journalRepository = journalRepository;
    }

    // CREATE
    public Journal save(Journal journal) {
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
    public Journal update(Long id, Journal updatedJournal) {

        Journal existingJournal = findById(id);

        existingJournal.setTitle(updatedJournal.getTitle());
        existingJournal.setDescription(updatedJournal.getDescription());
        existingJournal.setPrice(updatedJournal.getPrice());
        existingJournal.setPublisher(updatedJournal.getPublisher());

        return journalRepository.save(existingJournal);
    }

    // DELETE
    public void delete(Long id) {
        journalRepository.deleteById(id);
    }
}