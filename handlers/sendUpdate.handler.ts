import { MyContext } from "../bot";
import { getAllUsers } from "../models";
import { createTrade, getAllOrderByUserId } from "../models/trades.model";
import { sleep } from "../web3/contracts-handler";

export async function sendUpdatehandler(ctx: MyContext) {
	const allUser = await getAllUsers();
	const dan = ctx.chat.id.toString();
	//await createTrade(dan.toString(), "sdf", "erer");

	allUser.forEach(async (el, id) => {
		// if (id <= 2) {
		await ctx.api
			.sendMessage(
				parseInt(el.tgId),
				"Hi Fathomgunners, updates are still rolling in while you can use the bot. \n Stay positive"
			)
			.then((res) => {
				console.log("sent");
			})
			.catch((err) => {
				console.log("not sent");
			});
		//	}
	});
}
