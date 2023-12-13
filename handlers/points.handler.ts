import { MyContext } from "../bot";
import { updateUser } from "../models";

export async function pointsHandler(ctx: MyContext, points: number) {
	const userId = ctx.chat.id.toString();
	await updateUser(userId, { points });
}
