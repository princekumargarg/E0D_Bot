# Telegram EOD Report Bot

A Telegram bot that helps you send your End Of Day (EOD) reports as formatted emails. The bot listens for your message (which contains your task description) and then sends an email with a formatted HTML table including the date, day, and task details. It also supports sending a CC email if needed.

## Features

- **Telegram Integration:**  
  Uses the [Telegraf](https://telegraf.js.org/) library to handle Telegram bot interactions.
  
- **Email Sending:**  
  Uses [Nodemailer](https://nodemailer.com/about/) to send EOD report emails with a formatted table.
  
- **Customizable Email Content:**  
  The email subject includes your name, department, current date, and day of the week. The email body displays the report details in a table with a header row and a single data row (both with a light yellow background).

- **Environment Configuration:**  
  Uses the [dotenv](https://www.npmjs.com/package/dotenv) package to securely manage sensitive credentials via a `.env` file.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12 or later)
- npm (comes with Node.js)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/telegram-eod-report-bot.git
   cd telegram-eod-report-bot
