import Conversations from "./Conversations";  
import LogoutButton from "./LogoutButton";  
import SearchInput from "./SearchInput";  
import { useState } from 'react';  

const Sidebar = ({ currentUserName }) => {  
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust as per your mobile breakpoint  

	const updateMedia = () => {  
		setIsMobile(window.innerWidth <= 768);  
	};  

	// Add an event listener to handle window resize  
	window.addEventListener('resize', updateMedia);  

	return (  
		<div className='border-r border-slate-500 p-4 flex flex-col bg-gray-900 bg-opacity-50 w-full h-screen'>  
			<SearchInput />  
			<div className='divider px-3'></div>  
			{isMobile && (  
				<div className='flex justify-between items-center bg-gray-800 p-2 rounded-md mb-2'>  
					<span className='text-white'>{currentUserName}</span>  
				</div>  
			)}  
			<Conversations />  
			{isMobile && (  
				<div className='mt-auto'>  
					<LogoutButton />  
				</div>  
			)}  
		</div>  
	);  
};  

export default Sidebar;