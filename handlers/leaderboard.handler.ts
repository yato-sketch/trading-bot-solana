import { MyContext } from "../bot";
import { getAllUsers } from "../models";
import { rewardsMenu } from "../views";

export async function getLeaderboard(ctx: MyContext, msgId: number) {
	const user = await getAllUsers();
	let leaderboard = `Name    | Points   `;
	user.forEach((el) => {
		leaderboard += `\n${el.userName} | ${el.points}`;
	});

	await ctx.api.editMessageText(ctx.chat.id, msgId, leaderboard, {
		reply_markup: rewardsMenu(),
		parse_mode: "HTML",
	});
}
