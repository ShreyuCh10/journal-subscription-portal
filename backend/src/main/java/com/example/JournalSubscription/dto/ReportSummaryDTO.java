package com.example.JournalSubscription.dto;
import lombok.Data;
@Data
public class ReportSummaryDTO {

    private long totalUsers;
    private long subscribedUsers;
    private long interestedUsers;
    private long totalJournals;
    private long totalSubscriptions;
    private long activeSubscriptions;
    private long totalPayments;
    private long successfulPayments;
    private long failedPayments;
    private double totalRevenue;

    // ===== GETTERS & SETTERS =====
//
//    public long getTotalUsers() { return totalUsers; }
//    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
//
//    public long getSubscribedUsers() { return subscribedUsers; }
//    public void setSubscribedUsers(long subscribedUsers) { this.subscribedUsers = subscribedUsers; }
//
//    public long getInterestedUsers() { return interestedUsers; }
//    public void setInterestedUsers(long interestedUsers) { this.interestedUsers = interestedUsers; }
//
//    public long getTotalJournals() { return totalJournals; }
//    public void setTotalJournals(long totalJournals) { this.totalJournals = totalJournals; }
//
//    public long getTotalSubscriptions() { return totalSubscriptions; }
//    public void setTotalSubscriptions(long totalSubscriptions) { this.totalSubscriptions = totalSubscriptions; }
//
//    public long getActiveSubscriptions() { return activeSubscriptions; }
//    public void setActiveSubscriptions(long activeSubscriptions) { this.activeSubscriptions = activeSubscriptions; }
//
//    public long getTotalPayments() { return totalPayments; }
//    public void setTotalPayments(long totalPayments) { this.totalPayments = totalPayments; }
//
//    public long getSuccessfulPayments() { return successfulPayments; }
//    public void setSuccessfulPayments(long successfulPayments) { this.successfulPayments = successfulPayments; }
//
//    public long getFailedPayments() { return failedPayments; }
//    public void setFailedPayments(long failedPayments) { this.failedPayments = failedPayments; }
//
//    public double getTotalRevenue() { return totalRevenue; }
//    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
}
