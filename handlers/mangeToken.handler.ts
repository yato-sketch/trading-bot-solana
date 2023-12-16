import { ethers, formatUnits, isAddress, parseEther, parseUnits } from "ethers";
import { callBackQueryComposer, setSessions } from ".";
import { MyContext } from "../bot";
import { CreateWallet, SafeToken } from "../web3";
import { NextFunction } from "grammy";
import { parseTxData, verifyContractCode } from "../web3/contracts-handler";
import { getUserDeployedTokensByTokenAddress } from "../models";
import { FaqButton, fundContractButton } from "../views";
const Wallet = new CreateWallet();
const { WalletSigner, getTransactionReciept } = Wallet;

export async function TransactionLoading(ctx: MyContext) {
	return await ctx.reply(
		" 🔄 Transaction is has been submitted 🔄 \n  🔄 Loading 🔄"
	);
}
export async function ParseError(ctx: MyContext, err: any) {
	console.log(err);
	const info = JSON.parse(JSON.stringify(err)).info;
	if (info) {
		console.log(
			JSON.parse(JSON.stringify(err)).shortMessage,
			JSON.parse(JSON.stringify(err)).code
		);
	}
	console.log(JSON.parse(JSON.stringify(err)));
	return await ctx.reply(
		`❌  Error Occurred while Transaction was Processing ❌  \n \n ⚠️ ${
			JSON.parse(JSON.stringify(err)).reason &&
			JSON.parse(JSON.stringify(err)).reason
		}⚠️ \n ${
			JSON.parse(JSON.stringify(err)).code &&
			JSON.parse(JSON.stringify(err)).code
		}\n   ⚠️ ${
			JSON.parse(JSON.stringify(err)).shortMessage &&
			JSON.parse(JSON.stringify(err)).shortMessage
		} \n ${
			JSON.parse(JSON.stringify(err)).error.message &&
			JSON.parse(JSON.stringify(err)).error.message
		} ⚠️\n  \nPls Try Again`,
		{ reply_markup: FaqButton }
	);
}

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
		await TransactionLoading(ctx);
		await tokenContract
			.setFinalTax()
			.then(async (res) => {
				console.log("Final Tax Set");
				await ctx.reply(
					`Final Tax Set \n 🎊TxHash:🎊 \n ${process.env.SCAN_URL}${res.hash}`
				);
			})
			.catch(async (err) => {
				await ParseError(ctx, err);
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
		await TransactionLoading(ctx);
		await tokenContract
			.renounceOwnership()
			.then(async (res) => {
				await ctx.reply(
					`Owner Ship Renounced \n 🎊TxHash:🎊 \n ${process.env.SCAN_URL}${res.hash}`
				);
			})
			.catch(async (err) => {
				console.log({ err });
				await ParseError(ctx, err);
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
		await TransactionLoading(ctx);
		await tokenContract
			.manualSwap()
			.then(async (res) => {
				await ctx.reply(
					`Tokens Swapped \n 🎊TxHash:🎊 \n ${process.env.SCAN_URL}${res.hash}`
				);
			})
			.catch(async (err) => {
				await ParseError(ctx, err);
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
		await TransactionLoading(ctx);
		await tokenContract
			.removeLimits()
			.then(async (res) => {
				await ctx.reply(
					`Limits Removed \n 🎊TxHash:🎊 \n ${process.env.SCAN_URL}${res.hash}`
				);
			})
			.catch(async (err) => {
				await ParseError(ctx, err);
			});
	}
);
MangeTokenHandler.set(
	"fund-contract",
	async (ctx: MyContext, contractAddress: string) => {
		ctx.session.walletAddress = contractAddress;
		ctx.reply("Continue ", {
			reply_markup: fundContractButton,
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
		await TransactionLoading(ctx);
		await tokenContract
			.openTrading()
			.then(async (res) => {
				await ctx.deleteMessage();
				await ctx.reply(
					`Token Trading Open  \n 🎊TxHash:🎊 \n ${process.env.SCAN_URL}${res.hash}`
				);
			})
			.catch(async (err) => {
				await ParseError(ctx, err);
			});
	}
);
MangeTokenHandler.set(
	"verify-contract",
	async (ctx: MyContext, contractAddress: string) => {
		const depToken = await getUserDeployedTokensByTokenAddress(
			contractAddress
		);
		console.log(depToken[0].transactionHash);
		const reciept = await getTransactionReciept(
			depToken[0].transactionHash,
			new ethers.JsonRpcProvider(process.env.RPC)
		);
		//console.log(reciept.data, reciept.from);
		const data = await parseTxData(reciept.data);
		//console.log(data);
		const ContractVerificationStatus = await verifyContractCode(
			contractAddress,
			parseInt(data[0].toString()),
			parseInt(data[1].toString()),
			parseInt(data[2].toString()),
			data[3],
			data[4],
			data[5],
			parseInt(data[6].toString()),
			parseInt(data[7].toString()),
			parseInt(data[8].toString()),
			reciept.from.toString()
		);
		await ctx.reply(`${ContractVerificationStatus}`);
	}
);

export { MangeTokenHandler };
