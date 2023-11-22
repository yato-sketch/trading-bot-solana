import { Conversation } from "@grammyjs/conversations";
import { Context } from "grammy";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { Menu } from "@grammyjs/menu";
import { finalTaxMenu } from "../views";

export async function setCustomInitTax(
	conversation: MyConversation,
	ctx: MyContext
) {
	ctx.reply("Pls kindly input Initial Tax For your Token");
	let response = await conversation.waitFor(":text");
	if (!response.msg.text) {
		ctx.deleteMessage();
		ctx.reply("Invalid Tax 🟥 \n Kindly input something above 1 :");
		response = await conversation.waitFor(":text");
		ctx.deleteMessage();
		ctx.session.initTax = parseInt(response.msg.text);
		ctx.session.isInitTaxSet = true;
		ctx.reply(`Initial Tax is Set to: ${ctx.session.initTax} ✅`);
		ctx.reply("Set Final Tax ", { reply_markup: finalTaxMenu });
	}
}
