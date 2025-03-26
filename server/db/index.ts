import mongoose from "mongoose";
import { DB_NAME } from "../src/constants";

const connectDB = async () => {
    try {
        const connectionString = process.env.ENVIRONMENT === "production" ? `${process.env.MONGODB_URI}/${DB_NAME}` : process.env.MONGODB_URI
        if(!connectionString) {
            throw new Error("MONGODB_URI is not defined")
        }
        await mongoose.connect(connectionString)
    } catch (error) {
        console.log("MongoDB connection error: ", error)
        process.exit(1)
    }
}

export default connectDB