import { ethers } from "ethers";

export async function getGasPrice(
	rpcUrl: string | ethers.FetchRequest | undefined
) {
	const provider = new ethers.JsonRpcProvider(rpcUrl);
	const gasPrice: any = (await provider.getFeeData()).gasPrice;
	//  console.log("Current gas price:", gasPrice.toString());
	return gasPrice.toString();
}
export async function getWalletAddress(privateKey: string | ethers.SigningKey) {
	const PubKey = new ethers.Wallet(privateKey).address;
	return PubKey;
}
