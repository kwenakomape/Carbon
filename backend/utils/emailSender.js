import nodemailer from "nodemailer";

export const sendEmail = (mailOptions, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kwenakomape3@gmail.com",
      pass: "bwlz jxee jpsa alez",
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
};


