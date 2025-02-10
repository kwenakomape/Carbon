import dayjs from "dayjs";

export const generateInvoiceEmailHTML = (
  invoiceDetails,
  paymentMethod,
  remainingCredits,
) => {
  const today = dayjs().format("D MMMM YYYY");
  const tableHeaders =
    paymentMethod === "CASH/CARD"
      ? [
          "Description",
          "Date",
          "Duration",
          "Name",
          "Specialization",
          "Amount (ZAR)",
        ]
      : [
          "Description",
          "Date",
          "Duration",
          "Name",
          "Specialization",
          "Credits Used",
        ];
  let headerRow = `<tr>${tableHeaders
    .map((header) => `<th>${header}</th>`)
    .join("")}</tr>`;
  let serviceRows = invoiceDetails
    .map(
      (service) =>
        ` <tr> <td>${service.service_name}</td>
         <td>${dayjs(service.session_date).format("DD MMM YYYY")}</td>
          <td>${service.session_duration}</td> <td>${service.specialist_name}</td> 
          <td>${service.specialist_type}</td> 
          ${
            paymentMethod === "CASH/CARD"
              ? service.session_amount
              : service.session_credits_used
          }
         </tr> `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceDetails[0].invoice_number}</title>
</head>
<body>
  <p>Dear ${invoiceDetails[0].member_name},</p>

  <p>I hope this message finds you well.</p>

  <p>Please find attached the invoice for the services provided on <strong>${dayjs(
    invoiceDetails[0].session_date
  ).format("DD MMMM YYYY")}</strong>.</p>
  
  
    ${paymentMethod === "CASH/CARD"
      ? `<p>The due date for payment is <strong>12 February 2025</strong>.</p>`
      : `<p>The services were paid for using <strong>SSISA Credits</strong></p>`}
  <h2>Invoice Details:</h2>

  <p><strong>Invoice Number:</strong> ${invoiceDetails[0].invoice_number}</p>
  <p><strong>Issue Date:</strong> ${today}</p>
  <p><strong>Due Date:</strong> 12 February 2025</p>

  <h3>Bill To:</h3>
  <p>Member Name: <strong>${invoiceDetails[0].member_name}</strong><br>
  Membership ID: ${invoiceDetails[0].member_id}<br>
  Email: <strong>${invoiceDetails[0].member_email}</strong></p>

  <h3>Description of Services:</h3>
  <table border="1" cellpadding="10">
    <thead> ${headerRow} </thead> 
    <tbody> ${serviceRows} </tbody>
  </table>
  <p><strong>Payment Method:</strong> ${paymentMethod}</p>
  ${
    paymentMethod === "CASH/CARD"
      ? `<p><strong>Total Amount Due:</strong> ZAR ${invoiceDetails[0].total_amount}</p>`
      : `<p><strong>Total Credits Used:<strong> ${invoiceDetails[0].total_credits_used}</strong></p>
       <p><strong>Remaining Credits:</strong> ZAR ${remainingCredits}</p>`
  }

  <p>Please feel free to reach out if you have any questions or need further information. We appreciate your prompt attention to this invoice and look forward to continuing our work together.</p>

  <p>Thank you for choosing SSISA. Stay fit, stay healthy!</p>

  <p>Best regards,</p>
  <p><strong>SSISA</strong><br>
  <em>Sports Science Institute of South Africa</em><br>
  123 Wellness Way, Cape Town, WC, South Africa<br>
  +27 21 123 4567<br>
  <a href="mailto:info@ssisa.com">info@ssisa.com</a></p>

  <p>For any queries, please contact us at +27 21 123 4567 or <a href="mailto:info@ssisa.com">info@ssisa.com</a>.</p>
</body>
</html>
`;
};
