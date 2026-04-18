import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);

        console.log("MongoDB Connected ✅");

    } catch (err) {
        console.log("MongoDB Error ❌", err);
        process.exit(1);
    }
};

export default connectDB;