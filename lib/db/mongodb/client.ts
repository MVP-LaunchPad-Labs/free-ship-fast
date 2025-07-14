import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
	mongo: MongoClient | undefined;
};

const uri = process.env.MONGODB_URI;
if (!uri) {
	throw new Error("MONGODB_URI environment variable is not set");
}

export const mongo = globalForMongo.mongo ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") globalForMongo.mongo = mongo;
