package com.example.JournalSubscription.service;

import com.example.JournalSubscription.entity.*;
import com.example.JournalSubscription.repository.PaymentRepository;
import com.example.JournalSubscription.repository.ReceiptRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final PaymentRepository paymentRepository;
    private final CurrentUserService currentUserService;

    public ReceiptService(
            ReceiptRepository receiptRepository,
            PaymentRepository paymentRepository,
            CurrentUserService currentUserService
    ) {
        this.receiptRepository = receiptRepository;
        this.paymentRepository = paymentRepository;
        this.currentUserService = currentUserService;
    }

    // ================== PUBLIC METHOD ==================
    public byte[] generateReceiptPdfByPayment(UUID paymentId) {

        try {
            // 🔐 Current user
            User user = currentUserService.getCurrentUser();

            // 🔍 Payment
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            // 🔐 SECURITY CHECK
            UUID ownerId = payment.getSubscription().getUser().getId();

            if (!ownerId.equals(user.getId())) {
                throw new RuntimeException("Unauthorized access");
            }

            // 🔍 Receipt
            Receipt receipt = receiptRepository
                    .findByPayment_Id(paymentId)
                    .orElseThrow(() -> new RuntimeException("Receipt not found"));

            return buildPdf(receipt, payment);

        } catch (Exception e) {
            throw new RuntimeException("Error generating receipt PDF", e);
        }
    }

    // ================== PDF BUILDER ==================
    private byte[] buildPdf(Receipt receipt, Payment payment) throws Exception {

        Document document = new Document(PageSize.A4, 40, 40, 50, 50);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD);
        Font sectionFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 12);
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);

        Paragraph title = new Paragraph("JOURNAL HUB", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        Paragraph subtitle = new Paragraph("Payment Receipt", sectionFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        document.add(subtitle);

        document.add(new Paragraph(" "));
        document.add(new LineSeparator());
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);
        table.setWidths(new float[]{40f, 60f});

        addRow(table, "Receipt Number", receipt.getReceiptNumber(), boldFont, normalFont);
        addRow(table, "Generated At", receipt.getGeneratedAt().toString(), boldFont, normalFont);
        addRow(table, "Amount Paid", "₹ " + payment.getAmount(), boldFont, normalFont);
        addRow(table, "Payment Method", payment.getPaymentMethod(), boldFont, normalFont);
        addRow(table, "Payment Date", payment.getPaymentDate().toString(), boldFont, normalFont);
        addRow(table, "Payment Status", payment.getStatus().name(), boldFont, normalFont);

        document.add(table);

        document.add(new LineSeparator());
        document.add(new Paragraph(" "));

        Paragraph thanks = new Paragraph(
                "Thank you for subscribing to Journal Hub.\n" +
                        "For support, contact support@journalhub.com",
                normalFont
        );
        thanks.setAlignment(Element.ALIGN_CENTER);
        document.add(thanks);

        document.close();

        return out.toByteArray();
    }

    // ================== HELPER ==================
    private void addRow(PdfPTable table,
                        String label,
                        String value,
                        Font labelFont,
                        Font valueFont) {

        PdfPCell cell1 = new PdfPCell(new Phrase(label, labelFont));
        cell1.setBorder(Rectangle.NO_BORDER);
        cell1.setPadding(8);
        table.addCell(cell1);

        PdfPCell cell2 = new PdfPCell(new Phrase(value, valueFont));
        cell2.setBorder(Rectangle.NO_BORDER);
        cell2.setPadding(8);
        table.addCell(cell2);
    }
}