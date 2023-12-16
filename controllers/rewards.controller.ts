import { MyContext } from "../bot";
import { fetchNewUserById } from "../models";
import { boldenText } from "../utils";
import { rewardsMenu } from "../views";
export async function rewardsController(ctx: MyContext) {
	const userDetails = await fetchNewUserById(ctx.chat.id.toString());
	const { referralCount, points } = userDetails;
	const refLink = `https://t.me/${process.env.BOT_USER_NAME}?start=${userDetails.tgId}`;
	ctx.reply(
		`${boldenText(
			"Rewards and Contest Panel"
		)} \n \nYour Referral Link: ${refLink} \nNumber of Referrals: ${referralCount} \nBullets: ${points}  \n \n`,
		{
			reply_markup: rewardsMenu(),
			parse_mode: "HTML",
		}
	);
}
