import express from "express";  
import { sendMessage, getMessages, markMessageAsRead } from "../controllers/message_controller.js";  
import protectRoute from "../middleware/protectRoute.js";  

const router = express.Router();  

// Get messages for a specific conversation  
router.get("/:id", protectRoute, getMessages); // Retrieves messages for a specific conversation  

// Send a message to a specific conversation  
router.post("/send/:id", protectRoute, sendMessage); // Sends a new message to a specific conversation  

// Mark a specific message as read  
router.post("/read/:messageId", protectRoute, markMessageAsRead); // Adjusted to use messageId for clarity  

export default router;