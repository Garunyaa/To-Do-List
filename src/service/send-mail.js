import nodemailer from "nodemailer";

export const mailSender = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });
    const mailOptions = {
      from: process.env.user,
      to,
      subject,
      text,
    };

    const mail = await transporter.sendMail(mailOptions);
    console.log(`Email sent:" ${mail.response}`);
  } catch (error) {
    console.log("Error sending mail", error);
  }
};
