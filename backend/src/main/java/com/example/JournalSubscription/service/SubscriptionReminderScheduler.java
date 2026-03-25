package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.Subscription;
import com.example.JournalSubscription.entity.User;
import com.example.JournalSubscription.repository.SubscriptionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
public class SubscriptionReminderScheduler {

    private final SubscriptionRepository subscriptionRepository;
    private final EmailService emailService;

    public SubscriptionReminderScheduler(
            SubscriptionRepository subscriptionRepository,
            EmailService emailService
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.emailService = emailService;
    }

    // ⏰ Run daily at 9 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendExpiryReminders() {

        LocalDate today = LocalDate.now();
        List<Subscription> subs = subscriptionRepository.findAll();

        for (Subscription sub : subs) {

            if (sub.getStatus() != Subscription.SubscriptionStatus.ACTIVE) continue;

            LocalDate endDate = sub.getEndDate();
            long daysLeft = ChronoUnit.DAYS.between(today, endDate);

            if (daysLeft == 60 || daysLeft == 30 || daysLeft == 14 ||
                    daysLeft == 7 || daysLeft == 3 || daysLeft == 1) {

                String sent = sub.getReminderSent();
                if (sent == null) sent = "";

                List<String> sentList = sent.isEmpty()
                        ? new ArrayList<>()
                        : Arrays.asList(sent.split(","));

                if (!sentList.contains(String.valueOf(daysLeft))) {

                    try {

                        // ✅ DIRECT RELATION (NO DB CALL)
                        User user = sub.getUser();
                        if (user == null) continue;

                        emailService.sendEmail(
                                user.getEmail(),
                                "Subscription Expiry Reminder ⚠",
                                buildEmailBody(user, sub, daysLeft)
                        );

                        // ✅ update history
                        sub.setReminderSent(sent + daysLeft + ",");
                        subscriptionRepository.save(sub);

                    } catch (Exception e) {
                        System.out.println("Reminder failed for sub: " + sub.getId());
                    }
                }
            }
        }
    }

    // ================= EMAIL =================
    private String buildEmailBody(User user, Subscription sub, long daysLeft) {

        String urgency;

        if (daysLeft <= 3) urgency = "⚠ URGENT";
        else if (daysLeft <= 7) urgency = "⚠ Important";
        else urgency = "Reminder";

        return "Hello " + user.getFullName() + ",\n\n" +
                urgency + ": Your subscription is expiring in " + daysLeft + " day(s).\n\n" +
                "Journal: " + sub.getJournal().getTitle() + "\n" +
                "Expiry Date: " + sub.getEndDate() + "\n\n" +
                "Please renew to continue receiving journals.\n\n" +
                "Thank you!";
    }
}