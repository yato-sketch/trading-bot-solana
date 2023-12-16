import { MyConversation } from ".";
import { MyContext } from "../bot";
import { setSessions } from "../handlers";
import { updateUser } from "../models";

export async function setcustomSlippageConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await ctx.reply(
		`Reply to this message with your desired slippage percentage. Minimum is 0%.`,
		{
			reply_markup: {
				force_reply: true,
				input_field_placeholder: "Slippage here",
			},
		}
	);
	let response = (await conversation.waitFor(":text")).msg.text;
	if (response.includes("%")) {
		if (!isNaN(parseFloat(response)) && isFinite(parseInt(response))) {
			if (parseFloat(response) <= 50) {
				const slippage = response.toString().slice(0, -1);
				await setSessions(ctx);
				await updateUser(ctx.chat?.id?.toString(), {
					slippage: slippage,
				}).then((res) => {
					ctx.session.slippage = slippage;
					ctx.reply("✅ Slippage Set to: " + response);
				});
			}
		} else {
			ctx.reply("Invalid Character");
		}
	} else {
		if (!isNaN(parseFloat(response)) && isFinite(parseInt(response))) {
			if (parseFloat(response) <= 50) {
				const slippage = response.toString();
				await setSessions(ctx);
				await updateUser(ctx.chat?.id?.toString(), {
					slippage: slippage,
				}).then((res) => {
					ctx.session.slippage = slippage;
					ctx.reply(`✅ Slippage Set to ${response} %`);
				});
			} else {
				ctx.reply("Invalid Valid Slippage, Above Recommend Slippage");
			}
		} else {
			ctx.reply("Invalid Character");
		}
	}
}
