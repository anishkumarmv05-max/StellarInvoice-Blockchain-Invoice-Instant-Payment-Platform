import jsPDF from "jspdf";

export function generateInvoicePDF(invoice) {
  const doc = new jsPDF();
  const marginX = 20;
  let y = 20;

  doc.setFontSize(20);
  doc.setTextColor(123, 97, 255);
  doc.text("StellarInvoice", marginX, y);

  doc.setFontSize(10);
  doc.setTextColor(100);
  y += 8;
  doc.text(`Invoice #${invoice.invoiceNumber}`, marginX, y);

  y += 15;
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text(`Bill To: ${invoice.clientName}`, marginX, y);
  y += 6;
  doc.text(`Email: ${invoice.clientEmail}`, marginX, y);
  y += 6;
  doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, marginX, y);
  y += 6;
  doc.text(`Status: ${invoice.status.toUpperCase()}`, marginX, y);

  y += 12;
  doc.setFont(undefined, "bold");
  doc.text(invoice.title, marginX, y);
  doc.setFont(undefined, "normal");

  y += 10;
  doc.setFillColor(240, 240, 245);
  doc.rect(marginX, y - 5, 170, 8, "F");
  doc.setFontSize(10);
  doc.text("Item", marginX + 2, y);
  doc.text("Qty", 120, y);
  doc.text("Price", 145, y);
  doc.text("Subtotal", 170, y);

  y += 10;
  invoice.items.forEach((item) => {
    doc.text(item.name, marginX + 2, y);
    doc.text(String(item.quantity), 120, y);
    doc.text(`${item.price} XLM`, 145, y);
    doc.text(`${(item.quantity * item.price).toFixed(2)} XLM`, 170, y);
    y += 7;
  });

  y += 5;
  doc.setDrawColor(200);
  doc.line(marginX, y, 190, y);
  y += 8;
  doc.setFont(undefined, "bold");
  doc.text(`Total: ${invoice.totalAmount} XLM`, 145, y);
  doc.setFont(undefined, "normal");

  if (invoice.paymentTxHash) {
    y += 12;
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text("Payment Transaction Hash:", marginX, y);
    y += 5;
    doc.setFontSize(8);
    doc.text(invoice.paymentTxHash, marginX, y);
    y += 5;
    doc.text(
      `Verify: https://stellar.expert/explorer/testnet/tx/${invoice.paymentTxHash}`,
      marginX,
      y
    );
  }

  doc.save(`${invoice.invoiceNumber}.pdf`);
}
