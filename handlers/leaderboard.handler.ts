import { MyContext } from "../bot";
import { getAllUsers } from "../models";
import { boldenText } from "../utils";
import { rewardsMenu } from "../views";

export async function getLeaderboard(ctx: MyContext, msgId: number) {
	let user = await getAllUsers();
	let leaderboard = `🏆${boldenText(
		" Leaderboard "
		)}🏆 \n📍Only top 10 trading activities will show on the Leaderboard\n  \n${boldenText(
		"Name"
	)}    |    Points  \n `;
	user.sort((a, b) => b.points - a.points);
	user.forEach((el, id) => {
		if (id <= 9) {
			leaderboard += `\n${id + 1}. ${el.userName} | ${el.points}`;
		}
	});

	await ctx.api.editMessageText(ctx.chat.id, msgId, leaderboard, {
		reply_markup: rewardsMenu(),
		parse_mode: "HTML",
	});
}
