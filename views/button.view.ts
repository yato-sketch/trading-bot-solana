import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { MyContext } from "../bot";
import { CreateWallet, SafeToken } from "../web3";
import { ethers, parseEther, parseUnits } from "ethers";
import { callBackQueryComposer } from "../handlers";
import { TransactionLoading, ParseError } from "../handlers/mangeToken.handler";
import { rewardsController } from "../controllers/rewards.controller";
const Wallet = new CreateWallet();
const { WalletSigner, getTransactionReciept } = Wallet;

export const accountMenu = new Menu<MyContext>("withdraw-menu")
	.text("🏦 Withdraw FTM 🏦", async (ctx) => {
		// await ctx.conversation.exit();
		await ctx.conversation.enter("withdrawEthConversation");
	})
	.row()
	.text("📤 Import Wallet 📤", async (ctx) => {
		// await ctx.conversation.exit();
		await ctx.conversation.enter("importWalletConversation");
	})
	.row()
	.back("Return to Main Panel");
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
