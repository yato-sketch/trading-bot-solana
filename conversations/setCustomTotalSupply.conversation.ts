import { Conversation } from "@grammyjs/conversations";
import { Context } from "grammy";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { Menu } from "@grammyjs/menu";
import { initTaxMenu } from "../views";

export async function setCustomTotalSupply(
	conversation: MyConversation,
	ctx: MyContext
) {
	ctx.reply("Pls kindly input the total Supply For your Token");
	let ttSup = await conversation.waitFor(":text");
	if (!ttSup.msg.text || parseInt(ttSup.msg.text) < 1000) {
		ctx.deleteMessage();
		ctx.reply(
			"Invalid Total Supply 🟥 \n Kindly input somthing above 1 thousand:"
		);
		ttSup = await conversation.waitFor(":text");
		ctx.deleteMessage();
		ctx.session.totalSupply = parseInt(ttSup.msg.text);
		ctx.session.isSetTotalSupply = true;
		ctx.reply(`Total Supply Set to: ${ctx.session.totalSupply}`);
		ctx.reply("Set Inital Tax ", { reply_markup: initTaxMenu });
		return 0;
		//ctx.menu.update()
	}
}
