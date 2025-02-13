import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async (): Promise<string> => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    const url2 = `${connection.connection.host}:${connection.connection.port}`;

    console.log(colors.cyan.bold("mongoDB connected to: " + url2));
    return "ok";
  } catch (error) {
    console.log(colors.bgRed.white.bold(error.message));
    // Exit process with failure
    process.exit(1);
  }
};
