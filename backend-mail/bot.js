const { Telegraf, Scenes } = require("telegraf");
const { session } = require("telegraf");
const { default: axios } = require("axios");
require("dotenv").config();

//const backendPostgresql = "http://localhost";
const backendPostgresql = "http://pmxresp-backend-service"; //"http://localhost";
const backendDir = "/pmx-resp";
const EMAIL_INPUT = 0;
let bot;

const emailDataWizard = new Scenes.WizardScene(
  "EMAIL_DATA_WIZARD_SCENE_ID",
  // Step 1
  async (ctx) => {
    await ctx.reply(
      "Estás a punto de registrar una cuenta para acceder al sistema de responsivas. Favor de ingresar un correo electrónico válido:"
    );

    return ctx.wizard.next();
  },
  // Step 2
  async (ctx) => {
    ctx.wizard.state.email = ctx.message.text;
    // Perform validation
    if (ctx.message.text === "/cancel") {
      await ctx.reply("Registro cancelado.");
      return ctx.scene.leave();
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(ctx.message.text)) {
      await ctx.reply(
        "Formato de correo electrónico inválido. El registro ha sido cancelado."
      );
      return ctx.scene.leave(); // Go back to the previous step
    }

    // Save email to the database

    // Example: await pool.query('INSERT INTO users (email) VALUES ($1)', [email]);

    await ctx.reply(
      `Gracias, elija el tipo de usuario: \n1) Miembro Equipo\n2) Miembro Administrativo\n`
    );
    return ctx.wizard.next(); // End the conversation
  },
  // Step 3
  async (ctx) => {
    const type_of_user = ctx.message.text;
    const email = ctx.wizard.state.email;
    const chat_id = ctx.message.chat.id;

    // Perform validation
    if (ctx.message.text === "/cancel") {
      await ctx.reply("Registro cancelado.");
      return ctx.scene.leave();
    }

    if (!["1", "2"].includes(type_of_user)) {
      await ctx.reply(
        "El valor ingresado no es válido. El registro ha sido cancelado."
      );
      return ctx.scene.leave();
    }
    const loginResponse = await axios.post(`${backendPostgresql}/login`, {
      user: "pmxresp@outlook.com",
      password: "s0port3+Adm1n",
    });
    const token = loginResponse.data;
    const authRequest = await axios.post(
      `${backendPostgresql}${backendDir}/authrequest/register`,
      {
        affected_email: email,
        affected_type: type_of_user,
        chat_id: chat_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("AuthRequest: ", authRequest.status, authRequest.data);

    await ctx.reply(
      `Gracias, tu correo electrónico: ${email} fue registrado exitósamente. Esperando confirmación del administrador`
    );
    return ctx.scene.leave();
  }
);

async function sendNotification(
  text,
  chat_id = process.env.TELEGRAM_CHAT_GROUP_ID,
  type = "text"
) {
  try {
    if (type == "text")
      await bot.telegram.sendMessage(chat_id, text, {
        parse_mode: "HTML",
      });
    else if (type == "document") {
      await bot.telegram.sendDocument(chat_id, text);
    }
  } catch (error) {
    throw new Error("Error sending message to Telegram:", error);
  }
}

async function start(ctx) {
  console.log("La consola recibió esta notif start");
  await ctx.reply("I'm a bot, please talk to me!");
}

async function send_to_groups(ctx) {
  const chat_id = -1001612435955;
  console.log("Enviando a chat_id ", chat_id);
  await ctx.telegram.sendMessage(chat_id, "Hello. I'm just messaging to test");
}

async function cancel(ctx) {
  await ctx.reply("Registro cancelado.");
  return ctx.scene.leave();
}

async function startBot() {
  try {
    const stage = new Scenes.Stage([emailDataWizard]);
    const loginResponse = await axios.post(`${backendPostgresql}/login`, {
      user: "pmxresp@outlook.com",
      password: "s0port3+Adm1n",
    });
    const token = loginResponse.data;
    const notifData = await axios.get(
      `${backendPostgresql}${backendDir}/notification/bot`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const tokenBot = notifData.data.bot_id;

    bot = new Telegraf(tokenBot);
    bot.use(session());
    bot.use(stage.middleware());
    bot.command("start", start);
    bot.command("send", send_to_groups);
    bot.command("register", (ctx) =>
      ctx.scene.enter("EMAIL_DATA_WIZARD_SCENE_ID")
    );
    bot.launch();
    console.log("Bot started succesfully")
  } catch (error) {
    console.error("Error launching the bot:", error);
    // Handle the error and attempt to restart the bot
    setTimeout(startBot, 5000); // Restart the bot after 5 seconds
  }
}

function restartBot(delay = 3000) {
  if (!!bot) {
    console.log("Stopping the bot...");
    bot.stop();
    console.log(`Bot stopped. Restarting in ${delay / 1000} seconds...`);
    setTimeout(startBot, delay);
  } else {
    console.log("Nothing to restart...");
  }
}

module.exports = {
  startBot,
  sendNotification,
  restartBot,
};
