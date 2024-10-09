import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/authroutes.js";
import messageRoutes from "./routes/messageroute.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import userRoutes from "./routes/user_routes.js"

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes)

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () =>  {
    connectToMongoDB();
console.log(`server Running on port ${PORT}`) 
});