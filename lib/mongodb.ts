import mongoose from "mongoose";
import nextConfig from "../next.config";

declare global {
    var mongooseConn: Promise<typeof mongoose> | undefined;
}

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || nextConfig.API_MONGODB_URI;
    if (!uri) {
        throw new Error("Missing MongoDB URI. Please set MONGODB_URI environment variable.");
    }
    console.log("MongoDB connection attempt...");

    if (mongoose.connection.readyState === 1) {
        return true;
    }

    if (!global.mongooseConn) {
        console.log("Connecting to MongoDB... " + uri);
        global.mongooseConn = mongoose.connect(uri);
    }

    try {
        await global.mongooseConn;
        return true;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
