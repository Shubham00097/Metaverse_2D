import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log("Connecting to MongoDB with URI:", uri ? uri.split("@")[1] : "UNDEFINED"); // Masking password
        await mongoose.connect(uri);

        console.log("MongoDB Connected ✅");

    } catch (err) {
        console.log("MongoDB Error ❌", err);
        process.exit(1);
    }
};

export default connectDB;