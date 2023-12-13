import { Bot, CommandContext, Context } from "grammy";
import { sleep } from "../web3/contracts-handler";

export async function helpCommand(_ctx: CommandContext<Context>) {
	const { message_id, message_thread_id } = await _ctx.reply(
		`JOIN OUR TELEGRAM CHANNEL TO GET HELP \n ${process.env.BOT_NAME} `
	);
}
