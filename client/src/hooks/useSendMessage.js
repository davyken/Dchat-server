import { useState } from "react";  
import useConversation from "../zustand/useConversation"; // Update path if necessary  
import toast from "react-hot-toast";  

const useSendMessage = () => {  
    const [loading, setLoading] = useState(false);  
    const { messages, setMessages, selectedConversation } = useConversation();  

    const sendMessage = async (message) => {  
        setLoading(true);  
        try {  
            const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {  
                method: "POST",  
                headers: {  
                    "Content-Type": "application/json",  
                },  
                body: JSON.stringify({ message }), // Ensure "message" is properly passed  
            });  

            if (!res.ok) {  // Check for HTTP response status  
                const errorData = await res.json(); // Parse the error response  
                throw new Error(errorData.error || "Failed to send the message");  
            }  

            const data = await res.json();  
            setMessages([...messages, data]); // Add the sent message to the messages array  
            toast.success("Message sent!"); // Confirm message sent to user  
        } catch (error) {  
            toast.error(error.message); // Show any errors to the user  
        } finally {  
            setLoading(false); // Reset loading state  
        }  
    };  

    return { sendMessage, loading }; // Return sending function and loading state  
};  

export default useSendMessage;