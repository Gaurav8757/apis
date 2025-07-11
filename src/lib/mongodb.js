import mongoose from "mongoose";

const connectDB = async() => {
  try {
    const connectionIns = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log(
      `MongoDB connected !! DB Host: ${connectionIns.connection.host}`
    );
  } catch (error) {
    console.log("Mongo connection error", error);
    process.exit(1);
  }
};

export default connectDB;