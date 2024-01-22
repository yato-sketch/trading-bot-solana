import { MyContext } from "../bot";
import { rewardsMenu } from "../views";
import { boldenText } from "../utils";

export async function getTasks(ctx: MyContext, msgId: number) {
	ctx.api.editMessageText(
		ctx.chat.id,
		msgId,
		`🎯${boldenText(
				" TASK LIST"
			)} \n  \n1. Refer to earn - 80 points per referral \n2. Execute snipe - 150 points per snipe \n3. 10000 FTM in volume - 500 points \n4. Execute swaps - 50 points \n5. Copy trade - 70 points 
		`,
		{
			reply_markup: rewardsMenu(),
			parse_mode: "HTML",
		}
	);
}
