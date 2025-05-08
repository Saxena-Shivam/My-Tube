// require("dotenv").config({ path: "./.env" });
import dotenv from "dotenv";
import connectDB from "./DB/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config({ path: "./.env" });
//method 3
import express from "express";
const app = express();
connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection Failed:", err);
    process.exit(1);
  });
//method 1
// function connectDB() {
//   mongoose
//     .connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => console.log("MongoDB connected"))
//     .catch((err) => console.error("MongoDB connection error:", err));
// }
// connectDB();
//method 2
// import express from "express";
// const app = express();
// async () => {
//   try {
//     await mongoose.connect("${process.env.MONGODB_URI}/${DB_NAME}");
//     console.log("MongoDB connected");
//     app.on("error", (err) => {
//       console.error("MongoDB connection error:", err);
//       throw err;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     throw err;
//   }
// };
