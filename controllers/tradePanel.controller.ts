import { Bot, CommandContext, Context } from "grammy";
import { showDeployedTokenHandler } from "../handlers/showDeployedTokens";
import { MyContext } from "../bot";
import { TradingMenu, settingMenu } from "../views";
import { setSessions } from "../handlers";
import { fetchNewUserById } from "../models";
import { CreateWallet, getGasPrice, getWalletAddress } from "../web3";

const { EthBalance } = new CreateWallet();
export async function tradepanelContoller(_ctx: MyContext) {
	await setSessions(_ctx);
	const userId = _ctx.chat.id.toString()!;
	//get gas
	const gasPrice = await getGasPrice(process.env.RPC);
	const newuserData = await fetchNewUserById(userId);
	const walletAddress = await getWalletAddress(newuserData.privateKey);
	const NativeBalance = await EthBalance(walletAddress);
	const { autoBuy, slippage } = newuserData;
	const amountofTrades = 0;
	await _ctx.reply(
		`Welcome to  Quant Trading Bot \n \n  FTM fastest, simplest and cheapest trading bot
		Gas price: ${gasPrice} GWEI \n \n Wallet Address: \n ${walletAddress} \n \n Balance:\n ${NativeBalance} FTM \n \n  Auto Buy:\n ${autoBuy} \n \n Slippage: ${
			slippage ? slippage : "No Slippage"
		} \n \n Amount Of Trades: \n ${amountofTrades}   \n \n Click on settings To Set Trade Config \n Note: If you have Auto Buy enable make sure you import tokens`,
		{
			reply_markup: TradingMenu,
		}
	);
}
