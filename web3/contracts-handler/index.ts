import { verifyContract } from "./verifyContract";
import { generateConstructor } from "./generateConstructorHash";
import { checkContractVerification } from "./checkContractVerification";
export * from "./deconstructTxData";
export async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function verifyContractCode(
	contractAddress,
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
	const params = generateConstructor(
		_totalSupply,
		_initBuyTax,
		_initSellTax,
		_tokenSymbol,
		_tokenName,
		_marketingWallet,
		_decimal,
		finalSellTax,
		finalBuyTax,
		devWallet
	);
	//console.log(params);

	const guid = await verifyContract(contractAddress, params.substring(2));
	if (guid.result === "Contract source code already verified") {
		return "Contract source code already verified";
	} else {
		await sleep(9000);
		return await checkContractVerification(guid.result).then((res) => {
			return res.result;
		});
	}
}
// verifyContractCode(
// 	"0x8FfEd6abb790717B5b6217601F1Cb4EC6D5D4a0C",
// 	1000000,
// 	2,
// 	2,
// 	"DADCC",
// 	"DAD",
// 	"0x050B99ED0e9700f3749803358d02D985a19C9f4A",
// 	18,
// 	2,
// 	2,
// 	"0xE35191da83536d8f49ea0a29fE3D2236a338C3dA"
// )
// 	.then((res) => {
// 		console.log({ res });
// 	})
// 	.catch((err) => console.log({ err }));
