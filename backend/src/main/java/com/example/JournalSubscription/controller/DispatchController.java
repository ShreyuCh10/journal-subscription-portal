package com.example.JournalSubscription.controller;

import com.example.JournalSubscription.dto.DispatchDTO;
import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.service.DispatchService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dispatches")
public class DispatchController {

    private final DispatchService dispatchService;

    public DispatchController(DispatchService dispatchService) {
        this.dispatchService = dispatchService;
    }

    @GetMapping
    public List<DispatchDTO> getAll() {
        return dispatchService.getAllDispatches();
    }

    @GetMapping("/counts")
    public Map<String, Long> getCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("pending", dispatchService.countByStatus(Dispatch.DispatchStatus.PENDING));
        counts.put("shipped", dispatchService.countByStatus(Dispatch.DispatchStatus.SHIPPED));
        counts.put("delivered", dispatchService.countByStatus(Dispatch.DispatchStatus.DELIVERED));
        return counts;
    }

    @PutMapping("/{id}/status")
    public DispatchDTO updateStatus(@PathVariable Long id, @RequestParam String status) {
        return dispatchService.updateStatus(id, status);
    }

    @PostMapping
    public DispatchDTO create(@RequestBody Map<String, Long> body) {
        return dispatchService.createDispatch(
                body.get("subscriptionId"),
                body.get("userId"),
                body.get("journalId")
        );
    }
}
