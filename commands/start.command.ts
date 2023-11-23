import { Bot, CommandContext, Context } from "grammy";
import { startView } from "../views";
export async function startCommand(_ctx: CommandContext<Context>) {
	_ctx.reply(
		`Welcome to ${process.env.BOT_NAME} Token deployer Bot \n 1. /wallet to  see wallet info \n 2. /create to create new tokens`
	);
}
