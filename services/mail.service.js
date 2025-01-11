const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "mail",
      host: config.get("smtpHost"),
      port: config.get("smtpPort"),
      secure: true,
      auth: {
        user: config.get("smtpUser"),
        pass: config.get("smtpPassword"),
      },
    });
  }
  async sendMailActivationCode(toEmail, role, verification) {
    const link = `${config.get("apiUrl")}/api/${role}/verify/${verification}`;
    await this.transporter.sendMail({
      from: config.get("smtpUser"),
      to: toEmail,
      subject: "FreelanceHub akkauntini faollashtirish",
      text: "",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Akkauntni faollashtirish uchun quyidagi linkni bosing</h2>
      <a href="${link}" style="display: block; width: 200px; margin: 0 auto; padding: 15px; background-color: #3498db; color: white; text-align: center; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s;">FAOLLASHTIRISH</a>
    </div>
        `,
    });
  }
}

module.exports = new MailService();
