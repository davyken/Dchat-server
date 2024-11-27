import Conversation from "../models/conversation_model.js";
import Message from "../models/message_model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Function to send a message
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
			isRead: false,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save both conversation and new message in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Function to get messages for a conversation
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // Populate actual messages

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Function to mark a message as read
export const markMessageAsRead = async (req, res) => {
    const { id } = req.params; // Message ID from the URL

    try {
        const message = await Message.findByIdAndUpdate(id, { isRead: true }, { new: true });

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message marked as read', data: message });
    } catch (error) {
        console.log("Error in markMessageAsRead controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};