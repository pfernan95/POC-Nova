import nodemailer from "nodemailer";
import { Nomination } from "../../domain/entity/nomination";

export class NotifierController {
  notifyCandidate = (nomination: Nomination, reason: string) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: nomination.email,
      subject: `Application process resolution nº ${nomination.id}`,
      text: reason,
    };

    this.getMailer().sendMail(mailOptions);
  };

  notifyReferral = (
    nomination: Nomination,
    userEmail: string,
    reason: string
  ) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: `Application process resolution nº ${nomination.id}`,
      text: reason,
    };

    this.getMailer().sendMail(mailOptions);
  };

  getMailer() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
}
