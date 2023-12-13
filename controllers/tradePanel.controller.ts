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
		`🎉 Welcome to  QuanBot 🎉 \n \nFTM fastest 🚀, simplest ✨ and cheapest 🤑 trading bot 🤖 \n🚗 Gas price: ${gasPrice} GWEI \n \n💳 Wallet Address: \n${walletAddress} \n \n💰Balance:\n${NativeBalance} FTM \n \nAuto Buy:\n${autoBuy} \n \nSlippage 📉: ${
			slippage ? slippage : "No Slippage"
		} \n \nAmount Of Trades 💹: \n${amountofTrades}   \n \n⬇️ Click on settings To Set Trade Config ⚙️ ⬇️ \nNote 📝: If you have Auto Buy just paste to Buy`,
		{
			reply_markup: TradingMenu,
		}
	);
}
