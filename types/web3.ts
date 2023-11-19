import { AddressLike } from "ethers";

export type WalletGenerated = {
	privateKey: string;
	mnemonic: string;
	publicKey: AddressLike;
};
