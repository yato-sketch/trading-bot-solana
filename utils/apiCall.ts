require("dotenv").config();
import { createClient } from "@supabase/supabase-js";
import { User } from "../types";
import { APIERROR } from "../errors";
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

class apiCalls {
	async fetchUserByTgId(userID: string) {
		let { data: BettingBotUser, error } = await supabase
			.from("BettingBotUser")
			.select("*")
			.eq("tg_id", userID);
		if (error?.message) {
			APIERROR(`fetch error` + error.message + `${error.details}`);
			return "error Occured";
		}
		return BettingBotUser;
	}

	async createUser(props: User) {
		const { data, error } = await supabase
			.from("BettingBotUser")
			.insert([props])
			.select();
		if (error?.message) {
			APIERROR(`create error` + error.message + `${error.details}`);
			return error;
		}
		return data;
	}

	async updateUser(props: User) {
		const { data, error } = await supabase
			.from("BettingBotUser")
			.update(props)
			.eq("tg_id", props.tg_id)
			.select();
		if (error?.message) {
			APIERROR(`update error` + error.message + `${error.details}`);
			return error;
		}
		return data;
	}
	async createPool(props: any) {
		const { data, error } = await supabase
			.from("bettingPools")
			.insert([props])
			.select();
		if (error?.message) {
			APIERROR(
				`create betting pool  error` +
					error.message +
					`${error.details}`
			);
			return error;
		}
		return data;
	}
	async updatePool(props: any) {}
	async getOnePool(props: any) {
		let { data: bettingPools, error } = await supabase
			.from("bettingPools")
			.select("*")
			.eq("tg_id", props.eventId);
		if (error?.message) {
			APIERROR(`fetch error` + error.message + `${error.details}`);
			return "error Occured";
		}
		return bettingPools;
	}
	async createPoolTransaction(props: any) {}
	async updatePoolTransaction(props: any) {}
}

export default apiCalls;
