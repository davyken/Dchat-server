import { useState, useRef } from "react";
import { BsSend, BsEmojiSmile, BsX, BsPaperclip } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const fileInputRef = useRef(null);
	const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message && !selectedFile) return;
		
		if (selectedFile) {
			console.log("Uploading file:", selectedFile.name);
			
		}

		await sendMessage(message);
		setMessage("");
		setSelectedFile(null);
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

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white pr-24'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<div className='absolute inset-y-0 end-0 flex items-center pe-3'>
					<button
						type='button'
						className='mr-2 text-gray-400 hover:text-white'
						onClick={triggerFileInput}
					>
						<BsPaperclip />
					</button>
					<input
						type='file'
						ref={fileInputRef}
						onChange={handleFileChange}
						className='hidden'
						accept="image/*,.pdf,.doc,.docx,.txt"
					/>
					<button
						type='button'
						className='mr-2 text-gray-400 hover:text-white'
						onClick={toggleEmojiPicker}
					>
						<BsEmojiSmile />
					</button>
					<button type='submit' className='text-gray-400 hover:text-white'>
						{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
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
								<BsX size={24} />
							</button>
						</div>
						<EmojiPicker onEmojiClick={handleEmojiClick} />
					</div>
				)}
			</div>
			{selectedFile && (
				<div className='mt-2 text-sm text-gray-300'>
					Selected file: {selectedFile.name}
				</div>
			)}
		</form>
	);
};

export default MessageInput;