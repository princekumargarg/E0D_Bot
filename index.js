require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");
const nodemailer = require("nodemailer");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Telegram bot is running!");
});

app.listen(PORT, () => console.log(`HTTP server listening on port ${PORT}`));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const TARGET_EMAIL = process.env.TARGET_EMAIL;
const CC_EMAIL = process.env.CC_EMAIL;

if (!TELEGRAM_BOT_TOKEN || !EMAIL_USER || !EMAIL_PASS || !TARGET_EMAIL) {
  console.error(
    "Error: One or more required environment variables are missing."
  );
  process.exit(1);
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

function getFormattedDate() {
  const date = new Date();
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const options = { weekday: "long" };
  const dayOfWeek = date.toLocaleDateString("en-US", options);
  return { formattedDate, dayOfWeek };
}

const userChatIds = new Set();

bot.start((ctx) => {
  userChatIds.add(ctx.chat.id);

  const { formattedDate } = getFormattedDate();
  ctx.replyWithMarkdown(
    `*Welcome to the EOD Report Bot!* 😎\n\n` +
      `I'm here to help you quickly send your End Of Day reports as emails.\n` +
      `Don't forget to submit your EOD report for *${formattedDate}*.\n\n` +
      `Use the buttons below or type /help for more options.`,
    Markup.keyboard([["Send Report"], ["Help"]]).resize()
  );
});

bot.help((ctx) => {
  ctx.replyWithMarkdown(
    `*Available Commands:*\n` +
      `• /start - Restart the bot and display the welcome message\n` +
      `• /help - Show this help message\n\n` +
      `Simply type your EOD report details to send them via email.`
  );
});

bot.hears("Send Report", (ctx) => {
  ctx.reply("Please type your EOD report details:");
});

bot.on("text", (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith("/")) return;

  const taskDescription = text;
  const { formattedDate, dayOfWeek } = getFormattedDate();

  const name = "Prince Garg";
  const department = "Tech";

  const subject = `EOD Report | ${name} | ${department} | ${formattedDate}, ${dayOfWeek}`;

  const htmlBody = `
    <table border="1" cellpadding="5" cellspacing="0">
      <thead style="background-color: yellow;">
        <tr>
          <th>S. No</th>
          <th>Date</th>
          <th>Task Description</th>
          <th>Task Type</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        <tr >
          <td>1</td>
          <td>${formattedDate}</td>
          <td>${taskDescription}</td>
          <td>Untrade</td>
          <td>${department}</td>
        </tr>
      </tbody>
    </table>
  `;

  const mailOptions = {
    from: EMAIL_USER,
    to: TARGET_EMAIL,
    cc: CC_EMAIL,
    subject: subject,
    html: htmlBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      ctx.reply("❌ Sorry, there was an error sending the email.");
    } else {
      console.log("Email sent:", info.response);
      ctx.reply(
        `✅ Your EOD report for ${formattedDate}, ${dayOfWeek} has been sent successfully!`
      );
    }
  });
});

bot.launch();
console.log("Bot is running...");
