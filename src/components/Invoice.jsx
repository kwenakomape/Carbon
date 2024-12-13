
import {
  Button,
} from "semantic-ui-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

export const Invoice = ({
  handleNext,
  setPdfUrl,
  setPdfName,
  AppointmentId,
  paymentMethod,
  setinvoiceDetails,
  setRemainingCredits,
  memberId,
  total_credits_used,
  total_amount,
  setPdfEmailAttach,
  UpdateAppointmentStatus,
}) => {
  const [invoiceData, setInvoiceData] = useState(null);

  const fetchInvoiceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/invoices/details/${AppointmentId}`
      );
      setInvoiceData(response.data);
      setinvoiceDetails(response.data);
    } catch (error) {
      console.error("Error Generating Invoice:", error);
    }
  };

  const deductMemberCredits = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/paywith-credits/${memberId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error Deducting credits from Member Account:", error);
    }
  };

  const addInvoice = async () => {
    let data = {
      member_id: memberId,
      appointment_id: AppointmentId,
      total_credits_used: total_credits_used,
      total_amount: total_amount,
      payment_method: paymentMethod,
    };
    try {
      await axios.post("http://localhost:3001/api/add-invoice", data);
    } catch (error) {
      console.error("Error Adding Invoice:", error);
    }
  };

  const generateInvoicePDF = async () => {
    await addInvoice();
    await fetchInvoiceData();
  };

  useEffect(() => {
    if (invoiceData) {
      const generatePDF = async () => {
        let creditsRemaining = null;
        if (paymentMethod === "SSISA CREDITS") {
          creditsRemaining = await deductMemberCredits();
          setRemainingCredits(creditsRemaining[0].credits);
          if (!creditsRemaining) {
            console.error("Failed to deduct credits");
            return;
          }
        }

        const doc = new jsPDF();
        const today = dayjs().format("D MMMM YYYY");
        doc.setFontSize(20);
        doc.text("SSISA", 105, 10, { align: "center" });
        doc.setFontSize(12);
        doc.text("Sports Science Institute of South Africa", 105, 20, {
          align: "center",
        });
        doc.text("123 Wellness Way, Cape Town, WC, South Africa", 105, 25, {
          align: "center",
        });
        doc.text("+27 21 123 4567", 105, 30, { align: "center" });
        doc.text("info@ssisa.com", 105, 35, { align: "center" });
        doc.text(`Invoice No: ${invoiceData[0].invoice_number}`, 10, 50);
        doc.text(`Date: ${today}`, 10, 55);
        doc.text(`Bill To:`, 10, 65);
        doc.text(`Member Name: ${invoiceData[0].member_name}`, 20, 70);
        doc.text(`Member ID: ${invoiceData[0].member_id}`, 20, 75);
        doc.text(`Email: ${invoiceData[0].member_email}`, 20, 80);
        const tableHeaders =
          paymentMethod === "CASH/CARD"
            ? [
                [
                  "Description",
                  "Date",
                  "Duration",
                  "Name",
                  "Specialization",
                  "Amount (ZAR)",
                ],
              ]
            : [
                [
                  "Description",
                  "Date",
                  "Duration",
                  "Name",
                  "Specialization",
                  "Credits Used",
                ],
              ];
        const tableBody = invoiceData.map((session) => [
          session.service_name,
          dayjs(session.session_date).format("DD MMM YYYY"),
          session.session_duration,
          session.specialist_name,
          session.specialist_type,
          paymentMethod === "CASH/CARD" ? session.session_amount : session.session_credits_used,
        ]);
        doc.autoTable({ startY: 90, head: tableHeaders, body: tableBody });
        if (paymentMethod === "CASH/CARD") {
          doc.text(`Payment Method: CASH/CARD`, 10, doc.lastAutoTable.finalY + 10);
          doc.text(`Total Amount: ZAR ${invoiceData[0].total_amount}`, 10, doc.lastAutoTable.finalY + 15);
        } else {
          doc.text(
            `Payment Method: SSISA Credits`,
            10,
            doc.lastAutoTable.finalY + 10
          );
          doc.text(`Total Credits Used: ${invoiceData[0].total_credits_used}`, 10, doc.lastAutoTable.finalY + 15);
          doc.text(`Remaining Credits: ${creditsRemaining[0].credits}`, 10, doc.lastAutoTable.finalY + 20);
        }
        doc.text(
          "Thank you for choosing SSISA. Stay fit, stay healthy!",
          10,
          doc.lastAutoTable.finalY + 30
        );
        doc.text(
          "For any queries, please contact us at +27 21 123 4567 or info@ssisa.com.",
          10,
          doc.lastAutoTable.finalY + 35
        );

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
        setPdfName(`Invoice_${invoiceData[0].invoice_number}.pdf`);
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = function () {
          const base64data = reader.result;
          setPdfEmailAttach(base64data);
        };
        await UpdateAppointmentStatus("Seen");
        handleNext();
      };

      generatePDF();
    }
  }, [invoiceData]);

  return (
    <>
      <Button primary onClick={generateInvoicePDF}>
        Generate Invoice
      </Button>
    </>
  );
};