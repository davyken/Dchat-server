import React, { useState, useEffect, useRef } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { MessageSquare, Phone, Video, X } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import MobileNavBar from "../chat/mobile";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const [activeCall, setActiveCall] = useState(null); // 'video' or 'audio' or null
	const videoRef = useRef(null);

	useEffect(() => {
		return () => {
			setSelectedConversation(null);
			endCall();
		};
	}, [setSelectedConversation]);

	const startVideoCall = async () => {
		if (activeCall) return; // Prevent starting a new call if one is active
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
			setActiveCall('video');
		} catch (error) {
			console.error("Error accessing camera:", error);
		}
	};

	const startAudioCall = async () => {
		if (activeCall) return; // Prevent starting a new call if one is active
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });
			setActiveCall('audio');
		} catch (error) {
			console.error("Error accessing microphone:", error);
		}
	};

	const endCall = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			videoRef.current.srcObject.getTracks().forEach(track => track.stop());
		}
		setActiveCall(null);
	};

	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					<div className='bg-slate-500 px-4 py-2 mb-2 flex justify-between items-center'>
						<span className='label-text'></span>
						<div className='flex items-center gap-2'>
							<img
								src={selectedConversation.profilePic}
								alt={`${selectedConversation.fullName}'s profile`}
								className='rounded-full w-8 h-8 border-2 border-gray-200'
							/>
							<span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>
						</div>
						<div className='flex items-center gap-2'>
							<Phone
								className={`cursor-pointer ${activeCall === 'audio' ? 'text-green-500' : 'text-gray-900 hover:text-blue-500'}`}
								size={24}
								onClick={startAudioCall}
							/>
							<Video
								className={`cursor-pointer ${activeCall === 'video' ? 'text-green-500' : 'text-gray-900 hover:text-blue-500'}`}
								size={24}
								onClick={startVideoCall}
							/>
						</div>
					</div>
					{activeCall && (
						<div className='relative w-full h-64 mb-4 bg-gray-200 rounded-lg overflow-hidden'>
							{activeCall === 'video' && (
								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									className='w-full h-full object-cover'
								/>
							)}
							{activeCall === 'audio' && (
								<div className='w-full h-full flex items-center justify-center'>
									<Phone size={64} className='text-gray-600' />
								</div>
							)}
							<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2'>
								<button
									className='bg-red-500 text-white px-4 py-2 rounded-full font-semibold'
									onClick={endCall}
								>
									End Call
								</button>
							</div>
						</div>
					)}
					<Messages />
					<MessageInput />
					<MobileNavBar />
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
				<MessageSquare className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};