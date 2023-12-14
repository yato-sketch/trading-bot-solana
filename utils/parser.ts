export const initTaxObject = {
	"2-%": 2,
	"6-%": 6,
	"10-%": 10,
};
export const finalTaxObject = {
	"2-%": 2,
	"6-%": 6,
	"10-%": 10,
};
export const DecimalObject = {
	"9": 9,
	"18": 18,
	"10": 10,
	"8": 8,
};

export const TotalSupplyObject = {
	"1-billion": 1000000000,
	"1-million": 1000000,
	"10-million": 10000000,
	"100-million": 100000000,
};

export const boldenText = (text: string) => `<b>${text}</b>`;
export const makeCopiable = (text: string) => `<code>${text}</code>`;

export function trimAddress(walletAddress: string, length = 8) {
	if (walletAddress.length <= length) {
		return walletAddress; // No need to trim if it's shorter than the specified length
	}
	const start = walletAddress.slice(0, length);
	const end = walletAddress.slice(-length);
	const trimmedAddress = `${start}...${end}`;
	return trimmedAddress;
}
