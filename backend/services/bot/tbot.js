const { Telegraf, Scenes } = require("telegraf");
const { session } = require("telegraf");
const authReqController = require("../../controller/authorizationRequestController");
require("dotenv").config();

const EMAIL_INPUT = 0;
let bot;
/*const emailDataWizard = new Scenes.WizardScene(
  "EMAIL_DATA_WIZARD_SCENE_ID",
  // Step 1
  async (ctx) => {
    await ctx.reply(
      "Estás a punto de registrar una cuenta para acceder al sistema de responsivas. Favor de ingresar un correo electrónico válido:"
    );
    ctx.wizard.state.email = {}
    return ctx.wizard.next();
  },
  // Step 2
  async (ctx) => {
    const email = ctx.message.text;

    // Perform validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      await ctx.reply(
        "Formato de correo electrónico inválido. Por favor ingrese un correo electrónico válido."
      );
      return ctx.wizard.back(); // Go back to the previous step
    }

    // Save email to the database
    // Example: await pool.query('INSERT INTO users (email) VALUES ($1)', [email]);

    await ctx.reply(
      `Gracias, tu correo electrónico: ${email} fue registrado exitósamente. Esperando confirmación del administrador`
    );
    return ctx.scene.leave(); // End the conversation
  }
);
*/

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

    const authRequest = await authReqController.insertAuthRequest({
      user_id_fk: 552,
      action_id_fk: 1,
      request_date: new Date().getTime(),
      affected_email: email,
      affected_type: type_of_user,
      chat_id: chat_id,
    });

    await ctx.reply(
      `Gracias, tu correo electrónico: ${email} fue registrado exitósamente. Esperando confirmación del administrador`
    );
    return ctx.scene.leave();
  }
);

async function sendNotification(
  message,
  chat_id = process.env.TELEGRAM_CHAT_GROUP_ID,
  type = 'text'
) {
  try {
    if(type == 'text')
    await bot.telegram.sendMessage(chat_id, message, {
      parse_mode: "HTML",
    });
    else if(type == 'document'){
      await bot.telegram.sendDocument(chat_id, message);
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

function startBot() {
  const stage = new Scenes.Stage([emailDataWizard]);
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  bot = new Telegraf(TOKEN);
  bot.use(session());
  bot.use(stage.middleware());
  bot.command("start", start);
  bot.command("send", send_to_groups);
  bot.command("register", (ctx) =>
    ctx.scene.enter("EMAIL_DATA_WIZARD_SCENE_ID")
  );
  bot.launch();
}

module.exports = {
  startBot,
  sendNotification,
};
