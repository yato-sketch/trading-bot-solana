import { Bot, CommandContext, Context } from "grammy";

import { getWalletAddress } from "../web3";
import { CreateWallet } from "../web3";
import { MyContext } from "../bot";
import { ethers } from "ethers";
import { accountMenu } from "../views";
import { fetchNewUserById } from "../models";
import { walletController } from "../controllers/wallet.controller";

const Wallet = new CreateWallet();

export async function WalletCommand(ctx: CommandContext<MyContext>) {
	await walletController(ctx as MyContext);
}
