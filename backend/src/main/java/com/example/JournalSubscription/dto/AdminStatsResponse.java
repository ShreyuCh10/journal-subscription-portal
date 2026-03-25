package com.example.JournalSubscription.dto;

public class AdminStatsResponse {

    private long totalUsers;
    private long totalJournals;
    private long activeSubscriptions;
    private double revenue;

    public AdminStatsResponse(long totalUsers, long totalJournals, long activeSubscriptions, double revenue) {
        this.totalUsers = totalUsers;
        this.totalJournals = totalJournals;
        this.activeSubscriptions = activeSubscriptions;
        this.revenue = revenue;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getTotalJournals() { return totalJournals; }
    public long getActiveSubscriptions() { return activeSubscriptions; }
    public double getRevenue() { return revenue; }
}