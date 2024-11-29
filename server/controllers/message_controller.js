import Message from '../models/message_model.js';  
import Conversation from '../models/conversation_model.js';  
import { getReceiverSocketId, io } from '../socket/socket.js';  
import cloudinary from 'cloudinary';  
import { upload } from '../middleware/multerconfig.js'; // Middleware for file uploads  

// Function to get messages in a conversation  
export const getMessages = async (req, res) => {  
    try {  
        const conversationId = req.params.id; // Get conversation ID from parameters  
        const messages = await Message.find({ conversationId }) // Fetch messages based on the conversation ID  
            .sort({ createdAt: 1 }) // Sort messages by creation date, ascending  
            .populate('senderId', 'username profilePicture') // Populate sender details (example)  
            .exec();  

        res.status(200).json(messages); // Respond with messages  
    } catch (error) {  
        console.error("Error fetching messages:", error);  
        res.status(500).json({ error: "Internal server error" });  
    }  
};  

// Function to send a message  
export const sendMessage = async (req, res) => {  
    try {  
        const { message } = req.body; // Get text message from request body  
        const { id: receiverId } = req.params; // Get receiver ID from route parameters  
        const senderId = req.user._id; // Get sender ID from authenticated user  

        // Handle file upload  
        const file = req.file; // file sent with the request  
        let imageUrl = null; // Variable to hold the uploaded image URL  

        if (file) {  
            // Upload the image to Cloudinary  
            imageUrl = await new Promise((resolve, reject) => {  
                const uploadStream = cloudinary.v2.uploader.upload_stream((error, result) => {  
                    if (error) {  
                        return reject("Cloudinary upload error: " + error.message);  
                    }  
                    resolve(result.secure_url); // Get the URL of the uploaded image  
                });  

                // Stream the buffer to Cloudinary  
                uploadStream.end(file.buffer);  
            });  
        }  

        // Find existing conversation  
        let conversation = await Conversation.findOne({  
            participants: { $all: [senderId, receiverId] }, // Check if conversation exists  
        });  

        // Create a new conversation if it doesn't exist  
        if (!conversation) {  
            conversation = await Conversation.create({  
                participants: [senderId, receiverId],  
            });  
        }  

        // Create new message  
        const newMessage = new Message({  
            senderId,  
            receiverId,  
            message,  
            imageUrl,  
            isRead: false,  
            conversationId: conversation._id // Associate message with conversation  
        });  

        // Add message to conversation  
        conversation.messages.push(newMessage._id);  

        // Save both conversation and the new message  
        await Promise.all([conversation.save(), newMessage.save()]);  

        // Emit new message event via Socket.IO  
        const receiverSocketId = getReceiverSocketId(receiverId);  
        if (receiverSocketId) {  
            io.to(receiverSocketId).emit("newMessage", newMessage);  
        }  

        // Respond with the newly created message  
        res.status(201).json(newMessage);  
    } catch (error) {  
        console.error("Error in sendMessage controller:", error.message);  
        res.status(500).json({ error: "Internal server error" });  
    }  
};  

// Function to mark message as read  
export const markMessageAsRead = async (req, res) => {  
    try {  
        const { messageId } = req.params; // Get message ID from parameters  

        const message = await Message.findById(messageId); // Find the message by ID  
        if (!message) {  
            return res.status(404).json({ error: "Message not found" });  
        }  

        message.isRead = true; // Update the message to mark it as read  
        await message.save(); // Save updated message  

        res.status(200).json({ message: "Message marked as read" });  
    } catch (error) {  
        console.error("Error marking message as read:", error);  
        res.status(500).json({ error: "Internal server error" });  
    }  
};  

// Exporting the functions  
// export { sendMessage, getMessages, markMessageAsRead, uploadMiddleware };