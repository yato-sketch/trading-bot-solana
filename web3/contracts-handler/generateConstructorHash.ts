import { ethers } from "ethers";
import { Token__factory } from "../../types/contracts";

const constructorAbi = [
	"uint256",
	"uint256",
	"uint256",
	"string",
	"string",
	"address",
	"uint256",
	"uint256",
	"uint256",
	"address",
];

export function generateConstructor(
	_totalSupply: number,
	_initBuyTax: number,
	_initSellTax: number,
	_tokenSymbol: string,
	_tokenName: string,
	_marketingWallet: any,
	_decimal: number,
	finalSellTax: number,
	finalBuyTax: number,
	devWallet: any
) {
	const encoded = ethers.AbiCoder.defaultAbiCoder().encode(constructorAbi, [
		_totalSupply,
		_initBuyTax,
		_initSellTax,
		_tokenSymbol,
		_tokenName,
		_marketingWallet,
		_decimal,
		finalSellTax,
		finalBuyTax,
		devWallet,
	]);

	return encoded;
}
