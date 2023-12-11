import { MyContext } from "../bot";
import { setSessions } from "../handlers";

export async function buyTokenController(ctx: MyContext) {
	await setSessions(ctx);
	await ctx.conversation.enter("buyTokenConversation");
	//get token address
	// for auto buy  check balance and buy
	// for no auto by select slippage amount then buy
}
