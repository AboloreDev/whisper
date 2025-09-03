import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDb connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(`MongoDb Connection Error:`, error);
  }
};
