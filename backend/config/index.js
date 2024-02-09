const dotenv = require("dotenv");
const fs = require("fs");

const config = {
  local: {
    mode: "local",
    port: 4000,
  },
  staging: {
    mode: "staging",
    port: 5000,
  },
  production: {
    mode: "production",
    port: 8080,
  },
};

function configPort(mode) {
  return config[mode || process.argv[2] || "production"] || config.local;
}

function updateTelegramBotToken(token) {
  process.env.TELEGRAM_BOT_TOKEN = token;
}

function updateTelegramChatId(chatId) {
  process.env.TELEGRAM_CHAT_GROUP_ID = chatId;
}

function updateNotificationTime(time) {
    process.env.NOTIFICATION_TIME = time;
}

module.exports = {
  configPort,
  updateTelegramBotToken,
  updateTelegramChatId,
  updateNotificationTime,
};
