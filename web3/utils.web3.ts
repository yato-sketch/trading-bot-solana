import { ethers } from "ethers";

export async function getGasPrice(chainUrl: string) {}
export async function getWalletAddress(privateKey: string | ethers.SigningKey) {
	const PubKey = new ethers.Wallet(privateKey).address;
	return PubKey;
}
