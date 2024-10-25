import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import multer from "multer";
// import fs from "fs";
// import { fileURLToPath } from "url";

import authRoutes from "./routes/authroutes.js";
import messageRoutes from "./routes/messageroute.js";
import userRoutes from "./routes/user_routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
// import { File } from "./models/file.model.js"; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Set up Multer for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

app.use(cookieParser());
app.use(express.json()); 

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// API endpoint for file upload
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   try {
//     const newFile = new File({
//       filename: req.file.originalname,
//       path: req.file.path,
//       type: req.file.mimetype
//     });

//     await newFile.save();

//     res.json({
//       message: 'File uploaded successfully',
//       fileUrl: `/uploads/${req.file.filename}` 
//     });
//   } catch (error) {
//     console.error('Error saving file to database:', error);
//     res.status(500).send('Error uploading file');
//   }
// });


// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});