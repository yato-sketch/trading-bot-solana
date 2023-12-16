import { Context, InlineKeyboard } from "grammy";
import {
	type Conversation,
	type ConversationFlavor,
	conversations,
	createConversation,
} from "@grammyjs/conversations";
import { isAddress } from "ethers";
import { CreateWallet, getWalletAddress } from "../web3";

import { MyContext } from "../bot";
import { setSessions } from "../handlers";
import { ParseError, TransactionLoading } from "../handlers/mangeToken.handler";
import { returnToMainMenu } from "../views";

type MyContext2 = MyContext & ConversationFlavor;
export type MyConversation = Conversation<MyContext2>;
const withDrawWallet = new CreateWallet();

async function validate(
	addy: string,
	conversation: MyConversation,
	ctx: MyContext
) {
	let reAddressCtx;

	if (!isAddress(reAddressCtx.msg.text)) {
		ctx.reply(
			"Not an Ethereum Address \n Kindly input Receiving Wallet Address:"
		);
		reAddressCtx = await conversation.waitFor(":text");
	}

	return reAddressCtx;
}
export default async function withdrawEthConversation(
	conversation: MyConversation,
	ctx: MyContext
) {
	await setSessions(ctx);
	const balance = parseFloat(
		await withDrawWallet.EthBalance(
			(await getWalletAddress(ctx.session.privateKey!)).toString()
		)
	);
	if (balance > 0) {
		//get wallet address
		ctx.reply("Kindly input Recieving Wallet Address");
		let reAddressCtx = await conversation.waitFor(":text");
		if (!isAddress(reAddressCtx.msg.text)) {
			ctx.reply(
				"Not an Ethereum Address \n Kindly input Receiving Wallet Address:"
			);
		} else {
			ctx.reply(
				"How much FTM do you want to send? You can use % notation or a regular number. \n \nIf you type 100%, it will transfer the entire balance."
			);

			let amountToSend = await conversation.waitFor(":text");
			if (amountToSend.message.text.includes("%")) {
				let amountCtx =
					parseFloat(amountToSend.msg.text.toString().slice(0, -1)) /
					100;
				await TransactionLoading(ctx);
				await withDrawWallet
					.sendEth(
						(balance * amountCtx).toString(),
						reAddressCtx.msg.text,
						ctx.session.privateKey!
					)
					.then((res) => {
						ctx.reply(
							`${process.env.SCAN_URL}${res.hash} \n${(
								balance * amountCtx
							).toString()} has been sent`,
							{ reply_markup: returnToMainMenu }
						);
						console.log({ res });
					})
					.catch(async (err) => {
						await ParseError(ctx, err);

						console.log({ err });
					});
			} else {
				await TransactionLoading(ctx);
				await withDrawWallet
					.sendEth(
						amountToSend.msg.text.toString(),
						reAddressCtx.msg.text,
						ctx.session.privateKey!
					)
					.then((res) => {
						ctx.reply(
							`${process.env.SCAN_URL}${
								res.hash
							} \n${amountToSend.msg.text.toString()} has been sent`,
							{ reply_markup: returnToMainMenu }
						);
						console.log({ res });
					})
					.catch(async (err) => {
						await ParseError(ctx, err);
						ctx.reply(
							"Error Occured while Sending \n Probably Gas Try again"
						);
						console.log({ err });
					});
			}
		}
	} else {
		ctx.reply("You have no Balance");
	}
}
