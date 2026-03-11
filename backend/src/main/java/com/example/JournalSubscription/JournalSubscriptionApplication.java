package com.example.JournalSubscription;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JournalSubscriptionApplication {

	public static void main(String[] args) {
		SpringApplication.run(JournalSubscriptionApplication.class, args);
	}

}
