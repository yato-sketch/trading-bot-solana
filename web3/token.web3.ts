import { Wallet } from "ethers";
import { safeMemeTokenDeployer } from ".";
import {
	Deployer,
	Deployer__factory,
	Token,
	Token__factory,
} from "../types/contracts";

export class SafeToken {
	signer: Wallet;
	tokenContract: Token;
	constructor(signer: Wallet, addy: string) {
		this.signer = signer;
		this.tokenContract = Token__factory.connect(addy, this.signer);
	}
	async renounceOwnership() {
		return await this.tokenContract.renounceOwnership();
	}
	async setFinalTax() {
		return await this.tokenContract.setFinalTax();
	}
	async manualSwap() {
		return await this.tokenContract.manualSwap();
	}
	async removeLimits() {
		return await this.tokenContract.removeLimits();
	}
	async openTrading() {
		return await this.tokenContract.openTrading();
	}

	async tokenSecondaryDetails() {
		return [
			(await this.tokenContract._marketingWallet()).toString(),
			(await this.tokenContract._maxTaxSwap()).toString(),
			(await this.tokenContract._maxTxAmount()).toString(),
			(await this.tokenContract._taxSwapThreshold()).toString(),
			(await this.tokenContract.buyTax()).toString(),
			(await this.tokenContract.sellTax()).toString(),
			(await this.tokenContract.decimals()).toString(),
		];
	}
	async fundContractwithToken(amount: string, tokenAddress: string) {
		console.log({ amount });
		return await this.tokenContract.transfer(tokenAddress, amount);
	}
}
