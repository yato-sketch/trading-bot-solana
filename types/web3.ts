import { AddressLike } from "ethers";

export type WalletGenerated = {
	privateKey: string;
	mnemonic: string;
	publicKey: AddressLike;
};

export type TokenDeployedGraph = {
	transactionHash: string;
	totalSupply: string;
	tokenName: string;
	deployedAddress: string;
	symbol: string;
	owner: string;
	id: string;
};
