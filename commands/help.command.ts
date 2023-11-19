import { Bot, CommandContext, Context } from "grammy";

export async function helpCommand(_ctx: CommandContext<Context>) {
	_ctx.reply(
		`JOIN ARE TELEGRAM CHANNEL TO GET HELP \n ${process.env.BOT_NAME} `
	);
}
