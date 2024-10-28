import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {  
	return (  
		<div className='border-r p-4 flex flex-col bg-gray-900 bg-opacity-50 md:w-1/3 w-full'>  
			<SearchInput />  
			<div className='divider px-3'></div>  
			<Conversations />  
			<LogoutButton />  
		</div>  
	);  
};  

export default Sidebar;


