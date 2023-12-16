import { MyContext } from "../bot";
import { boldenText } from "../utils";

export async function faqController(ctx: MyContext) {
	await ctx.reply(
		`ℹ️ FAQ \n${boldenText(
			"Transaction Error Messages"
		)} \n \n1. Insufficient Output Amount \n Your slippage tolerance is too low for this transaction. Either increase your slippage tolerance in the wallet settings or increase your gas price/delta to gain more priority on the blockchain.\n  \n2. ${boldenText(
			"Excessive/Insufficient Input Amount"
		)} \n This happens when the bot attempts to buy an exact number of number of tokens, but the token's volatility turns out to be too extreme, even with your slippage taken into consideration. For example, assume that you want to buy exactly 1 token, and the current price for that 1 token is 1 BNB. With 100% slippage, the bot will allow you to pay up to 2 BNB to get that token. If the token's volatility is too extreme that even 2 BNB isn't enough to purchase 1 token, the transaction will fail. For sells, it can happen when the bot is trying to sell 0 tokens.\n \n3. ${boldenText(
			"Insufficient funds for gas x price + value"
		)} \nYour wallet doesn't have enough funds to cover the transaction value and its gas fees. If you're using Ape Max, disable it and try again. If not, double check your gas settings and compare the potential gas fees to your wallet's BNB/ETH balance.
        \n \n4. ${boldenText(
			"Transfer Failed"
		)} \n This error can happen for a multitude of reasons. We mention a few here:\na. Trade hasn't been enabled yet.\nb. The transaction would've caused your wallet to exceed the contract's max wallet.\nc. There's a maximum allowed gas price on the contract.\nd. There's a transaction cooldown on the contract.\ne. For sells, the maximum allowed sell might be smaller than your attempted transaction.\nf. You got blacklisted, or the token became a honeypot.\n \n5. ${boldenText(
			"Underpriced Transaction "
		)}\n This error happens when you attempt a transaction while another transaction from the same wallet is already pending. The bot supports only one transaction per wallet at any given time.`,
		{ parse_mode: "HTML" }
	);
}
