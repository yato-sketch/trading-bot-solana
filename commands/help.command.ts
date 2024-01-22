import { Bot, CommandContext, Context } from "grammy";
import { sleep } from "../web3/contracts-handler";
import { askQuestion } from "../handlers/askquestion.handler";
import { MyContext } from "../bot";
import { Conversation } from "@grammyjs/conversations";
export async function helpCommand(_ctx: CommandContext<MyContext>) {
	await _ctx.reply(
		`JOIN OUR TELEGRAM CHANNEL TO GET HELP \n ${process.env.CHANNEL_LINK} `
	);
	//await askQuestion(_ctx as MyContext, "What is your Name?");

	console.log("first", _ctx.message.message_id);
}
