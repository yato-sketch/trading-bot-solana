require("dotenv").config();
import { error } from "console";

const dev = "0x3114fcDB4aC31D965b158c849c249E678d385D65";
const main = "0x6015E38F337904449F4D5ED59Bf4bB8c50916df8";
const dev_graph =
	"https://api.studio.thegraph.com/query/51321/t2-dep-bot-graph/2.0";
const main_graph =
	"https://api.studio.thegraph.com/query/51321/safememe-deployer-graph/2.0";
const test_rpc = "https://ethereum-goerli.publicnode.com";
const main_rpc =
	"https://mainnet.infura.io/v3/7c160b7a7c22491fbf0cd3e2c70ccd9d";
async function validate() {
	const monogo = process.env.DATABASE_URL;

	const botToken = process.env.BOT_TOKEN;
	const rpc = process.env.RPC;
	const botName = process.env.BOT_NAME;
	const channelId = process.env.CHANNEL_ID;
	const etherScanAPiKEy = process.env.ETHERSCAN_API_KEY;
	const scanurl = process.env.SCAN_URL;
	const graphClient = process.env.GRAPH_CLIENT;
	const deployerContract = process.env.DEPLOYER_CONTRACT_ADDRESS;
	const botUserName = process.env.BOT_USER_NAME;
	if (
		!botToken ||
		!monogo ||
		!rpc ||
		!botName ||
		!channelId ||
		!scanurl ||
		!etherScanAPiKEy ||
		!graphClient ||
		!deployerContract ||
		!botUserName
	) {
		throw error("Configurations are missing");
	} else {
		console.info("Configurations Files are Saved");
		console.log(`This is the SUPABASE_URL: ${monogo}`);
	}
}

export default validate;
