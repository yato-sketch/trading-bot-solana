import { MyConversation } from ".";
import { MyContext } from "../bot";
import { setSessions } from "../handlers";
import { updateUser } from "../models";

export async function setcustomSlippageConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await ctx.reply(
		`Reply to this message with your desired slippage percentage. Minimum is 0%.`
	);
	let response = (await conversation.waitFor(":text")).msg.text;
	if (response.includes("%")) {
		if (!isNaN(parseFloat(response)) && isFinite(parseInt(response))) {
			const slippage = response.toString().slice(0, -1);
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				slippage: slippage,
			});
			ctx.reply("✅ Slippage Set to: " + response);
		} else {
			ctx.reply("Invalid Character");
		}
	} else {
		if (!isNaN(parseFloat(response)) && isFinite(parseInt(response))) {
			const slippage = response.toString().slice(0, -1);
			await setSessions(ctx);
			await updateUser(ctx.chat?.id?.toString(), {
				slippage: slippage,
			});
			ctx.reply(`✅ Slippage Set to ${response} %`);
		} else {
			ctx.reply("Invalid Character");
		}
	}
}
