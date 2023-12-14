import { MyContext } from "../bot";
import { rewardsMenu } from "../views";
export async function rewardsController(ctx: MyContext) {
	ctx.reply("Rewards and Contest Panel", {
		reply_markup: rewardsMenu(),
		parse_mode: "HTML",
	});
}
