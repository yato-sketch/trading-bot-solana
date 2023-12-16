import { Bot, CommandContext, Context } from "grammy";
import { showDeployedTokenHandler } from "../handlers/showDeployedTokens";
import { MyContext } from "../bot";
import { settingMenu } from "../views";
import { setSessions } from "../handlers";

export async function configContoller(_ctx: MyContext) {
	await setSessions(_ctx);
	_ctx.reply(
		`👋 Welcome To Your Settings Panel 👋 \n \n 📋 AutoBuy: Trade immediately you click on buy \n \n📋 Notification: Recieve Notification \n \n📋 AutoBuy Amount: Amount to Auto Buy \n \n📋 Slippage: Buy and Sell Slippage \n \n📋 Sell Amount: Percent to Sell When you Click on Sell`,
		{
			reply_markup: settingMenu,
		}
	);
}
