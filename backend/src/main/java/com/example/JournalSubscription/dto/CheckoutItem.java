package com.example.JournalSubscription.dto;
import lombok.Data;

import java.util.UUID;

@Data
public class CheckoutItem {

    private UUID journalId;
    private Integer quantity;
    private Integer years;

//    public Long getJournalId() { return journalId; }
//    public void setJournalId(Long journalId) { this.journalId = journalId; }
//
//    public Integer getQuantity() { return quantity; }
//    public void setQuantity(Integer quantity) { this.quantity = quantity; }
//
//    public Integer getYears() { return years; }
//    public void setYears(Integer years) { this.years = years; }
}
