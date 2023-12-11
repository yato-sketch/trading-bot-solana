import { Bot, CommandContext, Context, InlineKeyboard } from "grammy";
import { showDeployedTokenHandler } from "../handlers/showDeployedTokens";
import { MyContext } from "../bot";
import { settingMenu } from "../views";
import { setSessions } from "../handlers";
import { fetchNewUserById } from "../models";
import { CreateWallet, getWalletAddress } from "../web3";
import { formatUnits } from "ethers";
const { tokenBalanceOf, getSymbol, getDecimals } = new CreateWallet();

const tokenBalanceView = async (
	ctx: MyContext,
	symbol: string,
	balance: string,
	decimal: string
) => {
	await setSessions(ctx);
	await ctx.reply(
		`Token Details \n \n Token Symbol:  ${symbol} \n Your Token  Balance: ${balance.toString()} \n Token Decimal: ${decimal.toString()}`
	);
};
export async function balancesController(ctx: MyContext) {
	const userId = ctx.chat.id.toString();
	const { tokens } = await fetchNewUserById(userId);
	const address = await getWalletAddress(ctx.session.privateKey);
	const rpc = process.env.RPC;
	if (tokens.length > 0) {
		for (let index = 0; index < tokens.length; index++) {
			const element = tokens[index];
			const balance = await tokenBalanceOf(address, element, rpc);
			const symbol = await getSymbol(element, rpc);
			const decimal = await getDecimals(element, rpc);
			console.log({ balance, symbol, decimal });
			tokenBalanceView(
				ctx,
				symbol,
				formatUnits(balance, decimal),
				decimal
			);
		}
	} else {
		ctx.reply(
			`No Tokens Available Pls Import  Tokens \n Note: Go to Trading Panel To Import Tokens`
		);
	}
}
