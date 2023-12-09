import { ethers } from "ethers";
export async function parseTxData(txData: string) {
	const abi = [
		"uint256",
		"uint256",
		"uint256",
		"string",
		"string",
		"address",
		"uint8",
		"uint256",
		"uint256",
	];
	const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
		abi,
		ethers.dataSlice(txData, 4)
	);
	return decoded;
}
