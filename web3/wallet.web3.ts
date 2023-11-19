import { ethers, Wallet } from "ethers";
import { WalletGenerated } from "../types/web3";

export default class CreateWallet {
	chainRPC = process.env.RPC;
	tokenABI = [
		// Standard ERC-20 functions
		"function balanceOf(address account) view returns (uint256)",
		"function transfer(address recipient, uint256 amount) returns (bool)",
		"function decimals() view returns (uint8)",
		"function _decimals() view returns (uint8)",
		"function symbol() view returns (string)",
		"function _symbol() view returns (string)",
		"function approve(address spender, uint256 amount) returns (bool)",
	];
	provider = new ethers.JsonRpcProvider(this.chainRPC);

	async createWallet(): Promise<WalletGenerated> {
		const mnemonic: string = ethers.Wallet.createRandom().mnemonic?.phrase!;
		//convert mnemonic to Privak
		const privateKey = Wallet.fromPhrase(mnemonic).privateKey;
		//convert mnemonic to PubKey
		const publicKey = Wallet.fromPhrase(mnemonic).publicKey;
		return {
			privateKey: privateKey,
			mnemonic: mnemonic,
			publicKey: publicKey,
		};
	}
	async importWallet(mnemonic: string): Promise<WalletGenerated> {
		const privateKey = Wallet.fromPhrase(mnemonic).privateKey;
		//convert mnemonic to PubKey
		const publicKey = Wallet.fromPhrase(mnemonic).publicKey;
		return { privateKey, mnemonic, publicKey };
	}

	async sendERC20TOken(
		amount: string,
		to: string,
		privateKey: string,
		tokenAddress: string
	) {
		const walletInstance = new ethers.Wallet(privateKey, this.provider);
		const tokenContract = new ethers.Contract(
			tokenAddress,
			this.tokenABI,
			walletInstance
		);
		const tx = await tokenContract.transfer(to, ethers.parseEther(amount));
		return await tx.wait();
	}
	async sendEth(amount: string, to: string, privateKey: string) {
		const walletInstance = new ethers.Wallet(privateKey, this.provider);
		const recipientAddress = to;
		const amountToSend = ethers.parseEther(amount);
		const transaction = {
			to: recipientAddress,
			value: amountToSend,
		};
		console.log(amountToSend, recipientAddress);
		const response = await walletInstance.sendTransaction(transaction);
		return response;
	}
	async EthBalance(account: string) {
		const balance = await this.provider.getBalance(account);

		// Convert the balance to Ether
		const etherBalance = ethers.formatEther(balance);

		return etherBalance;
	}
	async tokenBalanceOf(account: string, tokenAddress: string) {
		const tokenContract = new ethers.Contract(
			tokenAddress,
			this.tokenABI,
			this.provider
		);
		const balance = await tokenContract.balanceOf(account);
		return balance;
	}
	async getDecimals(tokenAddress: string) {
		const tokenContract = new ethers.Contract(
			tokenAddress,
			this.tokenABI,
			this.provider
		);

		try {
			const decimal = await tokenContract.decimals();
			return decimal;
		} catch (error) {
			const decimal = await tokenContract._decimals();
			return decimal;
		}
	}

	async approve(privateKey: string, tokenAddress: string, operator: string) {
		const walletInstance = new ethers.Wallet(privateKey, this.provider);
		const max = ethers.MaxUint256;
		const contract = new ethers.Contract(
			tokenAddress,
			this.tokenABI,
			walletInstance
		);
		const tx = await contract.approve(operator, max);
		return await tx.wait();
	}
}
