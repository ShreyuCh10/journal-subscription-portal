package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Dispatch;
import com.example.JournalSubscription.entity.DispatchStatus;
import com.example.JournalSubscription.repository.DispatchRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class MonthlyDispatchScheduler {

    private final DispatchRepository dispatchRepository;

    public MonthlyDispatchScheduler(DispatchRepository dispatchRepository) {
        this.dispatchRepository = dispatchRepository;
    }

    @Scheduled(cron = "0 0 9 1 * ?") // 1st of every month
    public void activateMonthlyDispatch() {

        LocalDate today = LocalDate.now();

        int month = today.getMonthValue();
        int year = today.getYear();

        List<Dispatch> dispatches =
                dispatchRepository.findByMonthAndYearAndStatus(
                        month,
                        year,
                        DispatchStatus.PENDING
                );

        for (Dispatch d : dispatches) {
            d.setStatus(DispatchStatus.PACKED);
            dispatchRepository.save(d);
        }
    }
}
