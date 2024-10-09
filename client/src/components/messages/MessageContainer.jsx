import { useEffect } from "react";  
import useConversation from "../../zustand/useConversation";  
import MessageInput from "./MessageInput";  
import Messages from "./Messages";  
import { TiMessages } from "react-icons/ti";  
import { RiPhoneFill, RiVideoFill } from "react-icons/ri"; // Import phone and video icons  
import { useAuthContext } from "../../context/AuthContext";  

const MessageContainer = () => {  

	const { selectedConversation, setSelectedConversation } = useConversation();  

	useEffect(() => {  
		// cleanup function (unmounts)  
		return () => setSelectedConversation(null);  
	}, [setSelectedConversation]);  

	return (  
		<div className='md:min-w-[450px] flex flex-col'>  
			{!selectedConversation ? (  
				<NoChatSelected />  
			) : (  
				<>  
					{/* Header */}  
					<div className='bg-slate-500 px-4 py-2 mb-2 flex justify-between items-center'>  
						<span className='label-text'></span>{" "}  
						<div className='flex items-center gap-2'>  
							{/* Profile Picture */}  
							<img   
								src={selectedConversation.profilePic}  
								alt={`${selectedConversation.fullName}'s profile`}   
								className='rounded-full w-8 h-8 border-2 border-gray-200' // You can adjust size and styling as needed  
							/>  
							<span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>  
						</div>  
						<div className='flex items-center gap-2'>   
							<RiPhoneFill className='text-gray-900 cursor-pointer hover:text-blue-500' size={24} />  
							<RiVideoFill className='text-gray-900 cursor-pointer hover:text-blue-500' size={24} />  
						</div>  
					</div>  
					<Messages />  
					<MessageInput />  
				</>  
			)}  
		</div>  
	);  
};  

export default MessageContainer;  

const NoChatSelected = () => {  
	const { authUser } = useAuthContext();  
	return (  
		<div className='flex items-center justify-center w-full h-full'>  
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>  
				<p>Welcome 👋 {authUser.fullName} ❄</p>  
				<p>Select a chat to start messaging</p>  
				<TiMessages className='text-3xl md:text-6xl text-center' />  
			</div>  
		</div>  
	);  
};