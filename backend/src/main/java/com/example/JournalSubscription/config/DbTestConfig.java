//package com.example.JournalSubscription.config;
//
//import com.example.JournalSubscription.entity.User;
//import com.example.JournalSubscription.repository.UserRepository;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.boot.CommandLineRunner;
//
//@Configuration
//public class DbTestConfig {
//
//    @Bean
//    CommandLineRunner testDatabase(UserRepository repo){
//        return args ->{
//            User user = new User();
//            user.setClerkUserId("clerk_test_002");
//            user.setUserName("Test User");
//            user.setEmail("testuser@gmail.com");
//            user.setRoleName("USER");
//
//            repo.save(user);
//
//            System.out.println("Database Connection Verified: User Saved");
//        };
//    }
//}
