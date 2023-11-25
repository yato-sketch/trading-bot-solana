import { Conversation } from "@grammyjs/conversations";
import { Context, InlineKeyboard } from "grammy";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { Menu } from "@grammyjs/menu";
import { initTaxMenu } from "../views";
import { customStateContext, myState, objectModifier } from "../utils";

// const defaultCustomState: customStateContext = {
// 	totalSupply: 0,
// 	initTax:0
// };
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
	}
	ctx.deleteMessage();

	ctx.session.totalSupply = parseInt(ttSup.msg.text);
	await myState.setDefaultState(ctx.chat?.id?.toString());
	const getUserState = await myState.getStore(ctx.chat?.id?.toString());

	await myState.setStore(
		ctx.chat?.id?.toString(),
		objectModifier(getUserState, "totalSupply", ctx.session.totalSupply)
	);

	ctx.session.isSetTotalSupply = true;
	await ctx.reply(`Total Supply Set to: ${ctx.session.totalSupply}`);
	await ctx.reply("Set Inital Tax ", { reply_markup: initTaxMenu });
}
