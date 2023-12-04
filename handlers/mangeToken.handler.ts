import { ethers } from "ethers";
import { setSessions } from ".";
import { MyContext } from "../bot";
import { CreateWallet, SafeToken } from "../web3";
const Wallet = new CreateWallet();
const { WalletSigner } = Wallet;
const MangeTokenHandler: Map<
	string,
	(ctx: MyContext, contractAddress: string) => void
> = new Map();
MangeTokenHandler.set(
	"set-final-tax",
	async (ctx: MyContext, contractAddress: string) => {
		const tokenContract = new SafeToken(
			await WalletSigner(
				ctx.session.privateKey,
				new ethers.JsonRpcProvider(process.env.RPC)
			),
			contractAddress
		);
		await tokenContract
			.setFinalTax()
			.then(async (res) => {
				console.log("Final Tax Set");
				await ctx.reply(`Final Tax Set \n ${res.hash}`);
			})
			.catch(async (err) => {
				await ctx.reply(
					`Error Occurred while Transaction was Processing \n check gas and pls try again`
				);
			});
	}
);
MangeTokenHandler.set(
	"renounce-token",
	async (ctx: MyContext, contractAddress: string) => {
		const tokenContract = new SafeToken(
			await WalletSigner(
				ctx.session.privateKey,
				new ethers.JsonRpcProvider(process.env.RPC)
			),
			contractAddress
		);
		await tokenContract
			.renounceOwnership()
			.then(async (res) => {
				await ctx.reply(`Owner Ship Renounced \n ${res.hash}`);
			})
			.catch(async (err) => {
				await ctx.reply(
					`Error Occurred while Transaction was Processing \n check gas and pls try again`
				);
			});
	}
);
MangeTokenHandler.set(
	"manual-swap",
	async (ctx: MyContext, contractAddress: string) => {
		const tokenContract = new SafeToken(
			await WalletSigner(
				ctx.session.privateKey,
				new ethers.JsonRpcProvider(process.env.RPC)
			),
			contractAddress
		);
		await tokenContract
			.manualSwap()
			.then(async (res) => {
				await ctx.reply(`Tokens Swapped \n ${res.hash}`);
			})
			.catch(async (err) => {
				await ctx.reply(
					`Error Occurred while Transaction was Processing \n check gas and pls try again`
				);
			});
		//	ctx.reply("Unclogging Contract");
	}
);
MangeTokenHandler.set(
	"remove-limits",
	async (ctx: MyContext, contractAddress: string) => {
		const tokenContract = new SafeToken(
			await WalletSigner(
				ctx.session.privateKey,
				new ethers.JsonRpcProvider(process.env.RPC)
			),
			contractAddress
		);
		await tokenContract
			.removeLimits()
			.then(async (res) => {
				await ctx.reply(`Limits Removed \n ${res.hash}`);
			})
			.catch(async (err) => {
				await ctx.reply(
					`Error Occurred while Transaction was Processing \n check gas and pls try again`
				);
			});
	}
);
MangeTokenHandler.set(
	"open-trading",
	async (ctx: MyContext, contractAddress: string) => {
		const tokenContract = new SafeToken(
			await WalletSigner(
				ctx.session.privateKey,
				new ethers.JsonRpcProvider(process.env.RPC)
			),
			contractAddress
		);
		await tokenContract
			.openTrading()
			.then(async (res) => {
				await ctx.reply(`Token Trading Open  \n ${res.hash}`);
			})
			.catch(async (err) => {
				await ctx.reply(
					`Error Occurred while Transaction was Processing \n check gas and pls try again`
				);
			});
	}
);

export { MangeTokenHandler };
