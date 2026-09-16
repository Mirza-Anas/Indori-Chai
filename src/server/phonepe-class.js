import { StandardCheckoutClient, Env } from "@phonepe-pg/pg-sdk-node";
 
const clientId = process.env.PG_CLIENT_ID;
const clientSecret = process.env.PG_CLIENT_SECRET;
const clientVersion = process.env.PG_CLIENT_VERSION;
const env = Env.SANDBOX;

export const phonePeClient = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);
