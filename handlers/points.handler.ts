import { MyContext } from "../bot";
import { fetchNewUserById, updateUser } from "../models";

export async function pointsHandler(ctx: MyContext, points: number) {
	const userId = ctx.chat.id.toString();
	const userData = await fetchNewUserById(userId);
	await updateUser(userId, { points: userData.points + points });
}
