import { Context, InlineKeyboard } from "grammy";
import {
	type Conversation,
	type ConversationFlavor,
	conversations,
	createConversation,
} from "@grammyjs/conversations";
import { isAddress } from "ethers";
import { CreateWallet, getWalletAddress } from "../web3";
import apiCalls from "../utils/apiCall";
import { MyContext } from "../bot";
import { setSessions } from "../handlers";
import { ParseError } from "../handlers/mangeToken.handler";

type MyContext2 = MyContext & ConversationFlavor;
export type MyConversation = Conversation<MyContext2>;
const withDrawWallet = new CreateWallet();

async function validate(addy: string, conversation: MyConversation, ctx: any) {
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
	//get wallet address
	ctx.reply("Kindly input Recieving Wallet Address");
	let reAddressCtx = await conversation.waitFor(":text");
	if (!isAddress(reAddressCtx.msg.text)) {
		ctx.reply(
			"Not an Ethereum Address \n Kindly input Receiving Wallet Address:"
		);
		reAddressCtx = await conversation.waitFor(":text");
	}
	const keyboardAmount = new InlineKeyboard()
		.text("0.5 %", "0.5")
		.text("1 %", "1")
		.text("10 %", "10")
		.row()
		.text("15 %", "15")
		.text("30 %", "30")
		.text("50 %", "50")
		.row()
		.text("55 %", "55")
		.text("60 %", "60")
		.text("70 %", "70")
		.row()
		.text("80 %", "80")
		.text("90 %", "90")
		.text("100 %", "98")
		.row();
	ctx.reply("Kindly input Amount to send: ", {
		reply_markup: keyboardAmount,
	});
	const responseAmount = await conversation.waitForCallbackQuery(
		[
			"0.5",
			"1",
			"1",
			"10",
			"15",
			"30",
			"50",
			"55",
			"60",
			"70",
			"80",
			"90",
			"98",
		],
		{
			otherwise: (ctx: Context) =>
				ctx.reply("Use the buttons!", { reply_markup: keyboardAmount }),
		}
	);
	const balance = parseFloat(
		await withDrawWallet.EthBalance(
			(await getWalletAddress(ctx.session.privateKey!)).toString()
		)
	);
	const amountCtx = parseFloat(responseAmount.match.toString()) / 100;

	await withDrawWallet
		.sendEth(
			(balance * amountCtx).toString(),
			reAddressCtx.msg.text,
			ctx.session.privateKey!
		)
		.then((res) => {
			ctx.reply(`${(balance * amountCtx).toString()} has been sent`);
			console.log({ res });
		})
		.catch(async (err) => {
			await ParseError(ctx, err);
			ctx.reply("Error Occured while Sending \n Probably Gas Try again");
			console.log({ err });
		});
}
