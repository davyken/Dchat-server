import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { RiPhoneFill, RiVideoFill } from "react-icons/ri";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const [callType, setCallType] = useState(null); // 'audio' or 'video'

	useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	const handleCall = (type) => {
		setCallType(type);
		// Simulate ending the call after 3 seconds
		setTimeout(() => setCallType(null), 3000);
	};

	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-500 px-4 py-2 mb-2 flex items-center justify-between relative'>
						<img 
							src={selectedConversation.profilePic || "/default-avatar.png"} 
							alt="Profile" 
							className="w-10 h-10 rounded-full"
						/>
						<div className="absolute left-1/2 transform -translate-x-1/2 text-center">
							<span className='label-text block'></span>
							<span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>
						</div>
						<div className='flex gap-2'>
							<RiPhoneFill 
								className='text-gray-900 cursor-pointer text-xl' 
								onClick={() => handleCall('audio')}
							/>
							<RiVideoFill 
								className='text-gray-900 cursor-pointer text-xl' 
								onClick={() => handleCall('video')}
							/>
						</div>
					</div>
					<Messages />
					<MessageInput />
					{callType && <CallModal type={callType} name={selectedConversation.fullName} />}
				</>
			)}
		</div>
	);
};

const CallModal = ({ type, name }) => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
		<div className="bg-white p-4 rounded-lg text-center">
			<p className="text-xl font-bold mb-2">
				{type === 'audio' ? 'Audio' : 'Video'} call with {name}
			</p>
			<p> call... (will close in 3 seconds)</p>
		</div>
	</div>
);

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