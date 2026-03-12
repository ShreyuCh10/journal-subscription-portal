package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.dto.ReportSummaryDTO;
import com.example.JournalSubscription.service.ReportService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public ReportSummaryDTO getSummary() {
        return reportService.getSummary();
    }
}
