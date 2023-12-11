import { isAddress } from "ethers";
import { MyConversation } from ".";
import { MyContext } from "../bot";
import { CreateWallet } from "../web3";
import { tradepanelContoller } from "../controllers/tradePanel.controller";
import { fetchNewUserById, updateUser } from "../models";
const { getDecimals, getSymbol } = new CreateWallet();
export async function importTokenConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	const userId = ctx.chat.id.toString();
	await ctx.reply("Pls kindly Enter the token contract Address ");
	let response = await conversation.waitFor(":text");
	console.log(ctx.session.walletAddress, response.msg.text);
	//check if address is valid
	const contrac = response.msg.text;
	if (isAddress(contrac)) {
		const decimal = await getDecimals(contrac, process.env.RPC);
		const symbol = await getSymbol(contrac, process.env.RPC);
		console.log({ decimal, symbol });
		if (decimal && symbol) {
			await ctx.reply(
				`Token Decimal ${decimal.toString()} \n Token Symbol:${symbol}`
			);
			await ctx.reply(
				"Type Y or y to add token or N or n to cancel import : "
			);
			let res = await conversation.waitFor(":text");
			if (res.msg.text === "Y" || res.msg.text === "y") {
				// send db request
				const userData = await fetchNewUserById(userId);
				let { tokens } = userData;
				const findToken = tokens.filter((el) => el === contrac);
				if (findToken.length > 1) {
					await ctx.reply(
						"Unable to Add Token . Token Exist Already"
					);
					await ctx.reply(`/trade Click to Go trade Panel`);
				} else {
					tokens.push(contrac);
					//console.log({ tokens });
					await updateUser(userId, { tokens })
						.then(async (res) => {
							await ctx.reply("Token Has Been Added");
							await ctx.reply(`/trade Click to Go trade Panel`);
						})
						.catch(async (err) => {
							await ctx.reply(
								"Unable to Add Token. Error Occured"
							);
							await ctx.reply(`/trade Click to Go trade Panel`);
						});
				}
			} else {
				ctx.deleteMessage();
				await ctx.reply(`/trade Click to Go trade Panel`);
			}
		} else {
			ctx.reply("Invalid Contract Address");
		}
	}
	//show token details
	//add to list
	//save database
}
