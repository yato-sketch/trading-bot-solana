require("dotenv").config();
import { createClient } from "@supabase/supabase-js";
import { error } from "console";

async function validate() {
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseKey = process.env.SUPABASE_KEY;
	const botToken = process.env.BOT_TOKEN;
	const rpc = process.env.RPC;
	const botName = process.env.BOT_NAME;
	const channelId = process.env.CHANNEL_ID;
	if (
		!botToken ||
		!supabaseKey ||
		!supabaseUrl ||
		!rpc ||
		!botName ||
		!channelId
	) {
		//console.log({ botToken, supabaseKey, supabaseUrl, rpc, botName });
		throw error("Configurations are missing");
	} else {
		console.info("Configurations Files are Saved");
		console.log(`This is the SUPABASE_URL: ${supabaseUrl}`);
	}
}

export default validate;
