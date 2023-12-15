import { MyConversation } from ".";
import { MyContext } from "../bot";
import { configContoller } from "../controllers/config.controller";
import { setSessions } from "../handlers";
import { updateUser } from "../models";

export async function customBuyAmountConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await setSessions(ctx);

	await ctx.reply(
		"Pls kindly Enter the Amount FTM to buy when you click on buy: "
	);
	let response = await conversation.waitFor(":text");
	if (Number.isInteger(parseInt(response.msg.text))) {
		await updateUser(ctx.chat.id.toString(), {
			buyAmount: response.msg.text.toString(),
		});
		await ctx.reply(`Buy Trading Amount St `);
	} else {
		await ctx.reply(
			"Invalid Value! \n Pls kindly Enter the Amount FTM to buy when you click on buy: "
		);
		response = await conversation.waitFor(":text");
		await updateUser(ctx.chat.id.toString(), {
			buyAmount: response.msg.text.toString(),
		});
		await ctx.reply(
			`Buy Trading Amount Set ${response.msg.text.toString()} `
		);
	}

	//save database
}
