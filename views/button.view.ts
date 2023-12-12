import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { MyContext } from "../bot";
import { CreateWallet, SafeToken } from "../web3";
import { ethers, parseEther, parseUnits } from "ethers";
import { callBackQueryComposer } from "../handlers";
import { TransactionLoading, ParseError } from "../handlers/mangeToken.handler";
const Wallet = new CreateWallet();
const { WalletSigner, getTransactionReciept } = Wallet;

export const DeployTokenMenu = new Menu<MyContext>("deployer-menu")
	.text("Deploy Token", (ctx) => {
		const {
			tokenName,
			tokenSymbol,
			tokendecimal,
			marketingWalletAddress,
			finTax,
			initTax,
			totalSupply,
		} = ctx.session;
		console.log({
			tokenName,
			tokenSymbol,
			tokendecimal,
			marketingWalletAddress,
			finTax,
			initTax,
			totalSupply,
		});
	})
	.row();

export const accountMenu = new Menu<MyContext>("withdraw menu")
	.text("Withdraw FTM", async (ctx) => {
		await ctx.conversation.enter("withdrawEthConversation");
	})
	.row()
	.text("Import Wallet", (ctx) => {
		ctx.reply(`Replace Wallets Todo`);
	})
	.row()
	.text("show Rewards", (ctx) => ctx.reply("show rewards"))
	.text("bot Usage analytics");
export const fundContractButton = new Menu<MyContext>("fundcontract").text(
	"Fund Contract",
	async (ctx) => {
		await ctx.conversation.enter("fundContractConversation");
	}
);
export const mangeTokenMenu = (addy: string) =>
	new InlineKeyboard()
		.text("Set Final Tax 💸", "m#set-final-tax" + `|${addy}`)
		.row()
		.text(" ⚠️ Renounce Ownership ⚠️", "m#renounce-token" + `|${addy}`)
		.row()
		.text("  Manual Swap🔄", "m#manual-swap" + `|${addy}`)
		.row()
		.text("Remove Limits 🗑️", "m#remove-limits" + `|${addy}`)
		.row()
		.text("Open Trading 📈", "m#open-trading" + `|${addy}`)
		.text("Fund Contract 📈", "m#fund-contract" + `|${addy}`)
		.row()
		.text("Verify Contract", "m#verify-contract" + `|${addy}`);
