import { MyContext } from "../bot";
import { getAllUsers } from "../models";
import { rewardsMenu } from "../views";

export async function getLeaderboard(ctx: MyContext, msgId: number) {
	let user = await getAllUsers();
	let leaderboard = `Name    | Points  \nOnly top 20 trading activities will show on the Leaderboard `;
	user.sort((a, b) => b.points - a.points);
	user.forEach((el, id) => {
		if (id <= 19) {
			leaderboard += `\n${id + 1} ${el.userName} | ${el.points}`;
		}
	});

	await ctx.api.editMessageText(ctx.chat.id, msgId, leaderboard, {
		reply_markup: rewardsMenu(),
		parse_mode: "HTML",
	});
}
