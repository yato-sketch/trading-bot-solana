import { Bot, CommandContext, Context } from "grammy";
import { TradingMenu } from "../views";
import { fetchNewUserById } from "../models";
import { getWalletAddress } from "../web3";
import { tradepanelContoller } from "../controllers/tradePanel.controller";
import { MyContext } from "../bot";

export const greenLight = "";
export const RedLight = "";
export async function tradeCommand(_ctx: CommandContext<Context>) {
	await tradepanelContoller(_ctx as MyContext);
}
