import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/authroutes.js";
import messageRoutes from "./routes/messageroute.js";
import userRoutes from "./routes/user_routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import User from "./models/user_model.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());
app.use(cookieParser());

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

// Set cookie
const generateTokenAndSetCookie = (userId, res) => {
  const token = generateToken(userId);
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};

// Endpoint for Google authentication
app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        fullName: name,
        email,
        googleId,
        profilePic: picture,
        password: "", // Empty password for Google auth users
        gender: "N/A", // Default value, can be updated later
      });
    }

    // Generate token and set cookie
    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Error in Google authentication:", error);
    res.status(500).json({
      error: "Authentication failed",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Your existing routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "client", "dist")));

// Ensure the index.html file is served correctly
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"), (err) => {
    if (err) {
      res.status(err.status).end();
    }
  });
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});