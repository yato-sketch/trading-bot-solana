import { Bot, CommandContext, Context } from "grammy";
import { sleep } from "../web3/contracts-handler";

export async function helpCommand(_ctx: CommandContext<Context>) {
	const { message_id, message_thread_id } = await _ctx.reply(
		`JOIN OUR TELEGRAM CHANNEL TO GET HELP \n ${process.env.BOT_NAME} `
	);
	console.log("first", _ctx.message.message_id);
	// await sleep(3000);
	// await _ctx.api.editMessageText(
	// 	_ctx.chat.id,
	// 	message_id,
	// 	"Here is the new text"
	// );
	// await sleep(3000);
	// const edit = _ctx.update.message.message_id + 1;
	// console.log({ edit });

	// await _ctx.api.editMessageText(
	// 	_ctx.chat.id,
	// 	edit,
	// 	".......Here is the new text........."
	// );
	// console.log({ message_id, message_thread_id, edit });
}
