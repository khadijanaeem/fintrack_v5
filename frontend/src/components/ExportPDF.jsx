import React from 'react';
import jsPDF from 'jspdf';

const ExportPDF = ({ transactions }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // --- Header ---
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('FinTrack - Transactions Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // --- Financial Summary ---
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = totalIncome - totalExpenses;

    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Financial Summary', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, margin, yPosition);
    yPosition += 5;
    doc.text(`Current Balance: $${balance.toFixed(2)}`, margin, yPosition);
    yPosition += 15;

    // --- Table Header ---
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const colPositions = [margin, 50, 100, 140, 165];

    doc.setFillColor(41, 128, 185);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    headers.forEach((header, i) => {
      doc.text(header, colPositions[i], yPosition + 6);
    });

    yPosition += 10;

    // --- Table Rows ---
    doc.setFontSize(9);
    transactions.forEach(transaction => {
      const rowHeight = 7;

      // Add new page if needed
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;

        doc.setFillColor(41, 128, 185);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
        doc.setTextColor(255, 255, 255);
        headers.forEach((header, i) => {
          doc.text(header, colPositions[i], yPosition + 6);
        });
        yPosition += 10;
        doc.setTextColor(0, 0, 0);
      }

      doc.setTextColor(0, 0, 0);
      doc.text(transaction.date || '', colPositions[0], yPosition);
      doc.text((transaction.description || '').substring(0, 25), colPositions[1], yPosition);
      doc.text(transaction.category || '', colPositions[2], yPosition);
      doc.text(transaction.type || '', colPositions[3], yPosition);

      // Color amount
      if (transaction.type === 'income') {
        doc.setTextColor(0, 128, 0);
      } else {
        doc.setTextColor(255, 0, 0);
      }
      doc.text(`$${Math.abs(transaction.amount).toFixed(2)}`, colPositions[4], yPosition, { align: 'right' });
      yPosition += rowHeight;
    });

    // --- Footer with page numbers ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }

    // --- Save PDF ---
    doc.save(`fintrack-transactions-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <button onClick={generatePDF} className="btn-pdf">
      Export to PDF
    </button>
  );
};

export default ExportPDF;
