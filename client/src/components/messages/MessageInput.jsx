import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Smile, X, Paperclip } from "lucide-react";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [isRecording, setIsRecording] = useState(false);
	const [recordedAudio, setRecordedAudio] = useState(null);
	const fileInputRef = useRef(null);
	const audioRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const { loading, sendMessage } = useSendMessage();

	useEffect(() => {
		return () => {
			if (mediaRecorderRef.current) {
				mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
			}
		};
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message && !selectedFile && !recordedAudio) return;
		
		if (selectedFile) {
			console.log("Uploading file:", selectedFile.name);
			// Implement file upload logic here
		}

		if (recordedAudio) {
			console.log("Sending audio message");
			// Implement audio sending logic here
			// You might want to convert the blob to a File object or send it directly
			// await sendMessage(recordedAudio);
		} else {
			await sendMessage(message);
		}

		setMessage("");
		setSelectedFile(null);
		setRecordedAudio(null);
	};

	const handleEmojiClick = (emojiObject) => {
		setMessage((prevMessage) => prevMessage + emojiObject.emoji);
	};

	const toggleEmojiPicker = () => {
		setShowEmojiPicker((prev) => !prev);
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			const audioChunks = [];
			mediaRecorder.addEventListener("dataavailable", (event) => {
				audioChunks.push(event.data);
			});

			mediaRecorder.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
				setRecordedAudio(audioBlob);
			});

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Error accessing microphone:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
			setIsRecording(false);
		}
	};

	const playRecordedAudio = () => {
		if (recordedAudio) {
			const audioUrl = URL.createObjectURL(recordedAudio);
			audioRef.current.src = audioUrl;
			audioRef.current.play();
		}
	};

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white pr-28'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					disabled={isRecording}
				/>
				<div className='absolute inset-y-0 end-0 flex items-center pe-3'>
					<button
						type='button'
						className='mr-2 text-gray-400 hover:text-white'
						onClick={triggerFileInput}
					>
						<Paperclip size={20} />
					</button>
					<input
						type='file'
						ref={fileInputRef}
						onChange={handleFileChange}
						className='hidden'
						accept="image/*,.pdf,.doc,.docx,.txt,audio/*"
					/>
					<button
						type='button'
						className='mr-2 text-gray-400 hover:text-white'
						onClick={toggleEmojiPicker}
					>
						<Smile size={20} />
					</button>
					<button
						type='button'
						className='mr-2 text-gray-400 hover:text-white'
						onClick={isRecording ? stopRecording : startRecording}
					>
						<Mic size={20} color={isRecording ? "red" : "currentColor"} />
					</button>
					<button type='submit' className='text-gray-400 hover:text-white'>
						{loading ? <div className='loading loading-spinner'></div> : <Send size={20} />}
					</button>
				</div>
				{showEmojiPicker && (
					<div className='absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg'>
						<div className='flex justify-end p-2'>
							<button
								type='button'
								className='text-gray-400 hover:text-white'
								onClick={toggleEmojiPicker}
							>
								<X size={24} />
							</button>
						</div>
						{/* Emoji picker component would go here */}
					</div>
				)}
			</div>
			{selectedFile && (
				<div className='mt-2 text-sm text-gray-300'>
					Selected file: {selectedFile.name}
				</div>
			)}
			{recordedAudio && (
				<div className='mt-2'>
					<audio ref={audioRef} controls className="w-full" />
					<button onClick={playRecordedAudio} className="mt-1 text-sm text-blue-500">
						Play recorded audio
					</button>
				</div>
			)}
			{isRecording && (
				<div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
					Recording in progress...
				</div>
			)}
		</form>
	);
};

export default MessageInput;