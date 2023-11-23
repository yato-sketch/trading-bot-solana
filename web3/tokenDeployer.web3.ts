import { AddressLike, BigNumberish, Typed, Wallet, parseEther } from "ethers";
import { safeMemeTokenDeployer } from ".";
import { Deployer, Deployer__factory } from "../types/contracts";
export class TokenDeployer {
	signer: Wallet;
	deployerContract: Deployer;
	constructor(signer: Wallet) {
		this.signer = signer;
		this.deployerContract = Deployer__factory.connect(
			safeMemeTokenDeployer,
			this.signer
		);
	}

	async deployNewToken(
		totalSupply: BigNumberish | Typed,
		iniBuyTax: BigNumberish | Typed,
		initSellTax: BigNumberish | Typed,
		tokenSymbol: string | Typed,
		tokenName: string | Typed,
		marketingWallet: AddressLike | Typed,
		Decimal: BigNumberish | Typed,
		finalBuyTax: BigNumberish | Typed,
		finalSellTax: BigNumberish | Typed
	) {
		return await this.deployerContract.deployNewContract(
			totalSupply,
			iniBuyTax,
			initSellTax,
			tokenSymbol,
			tokenName,
			marketingWallet,
			Decimal,
			finalBuyTax,
			finalSellTax,
			{ value: parseEther("0.0005") }
		);
	}
}
