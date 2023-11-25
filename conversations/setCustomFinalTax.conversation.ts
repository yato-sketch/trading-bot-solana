import { MyConversation } from ".";
import { MyContext } from "../bot";
import { myState, objectModifier } from "../utils";
import { decimalMenu, finalTaxMenu } from "../views";

export async function setCustomFinalTaxConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	ctx.reply("Pls kindly input Final Tax For your Token");
	let response = await conversation.waitFor(":text");
	if (!response.msg.text) {
		ctx.deleteMessage();
		ctx.reply("Invalid Tax 🟥 \n Kindly input something above 1 :");
		response = await conversation.waitFor(":text");
		ctx.deleteMessage();
	}
	ctx.session.finTax = parseInt(response.msg.text);
	ctx.session.isFinTaxSet = true;
	const getUserState = await myState.getStore(ctx.chat?.id?.toString());

	await myState.setStore(
		ctx.chat?.id?.toString(),
		objectModifier(getUserState, "finTax", ctx.session.finTax)
	);
	await ctx.reply(`Final Tax is Set to: ${ctx.session.finTax} ✅`);
	await ctx.reply("Set Token Decimal ", { reply_markup: decimalMenu });
}
