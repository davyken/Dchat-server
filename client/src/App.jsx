import { Navigate, Route, Routes } from "react-router-dom";  
import "./App.css";  
import Home from "./pages/home/Home";  
import Login from "./pages/login/Login";  
import SignUp from "./pages/signup/SignUp";  
import { Toaster } from "react-hot-toast";  
import { useAuthContext } from "./context/AuthContext";  
import ResertPassword from "./pages/resertpassword/resertpassword";  
import LandingPage from "./pages/landingPage/LandingPage"; // Import the LandingPage component  

function App() {  
    const { authUser } = useAuthContext();  
    return (  
        <div className='min-h-screen flex flex-col justify-center items-center'>  {/* items-center*/} 
                <Routes>  
                    <Route path='/' element={<LandingPage />} /> {/* New route for LandingPage */}  
                    <Route path='/home' element={authUser ? <Home /> : <Navigate to={"/login"} />} />  
                    <Route path='/login' element={authUser ? <Navigate to='/home' /> : <Login />} />  
                    <Route path='/signup' element={authUser ? <Navigate to='/home' /> : <SignUp />} />  
                    <Route path="/resertpassword" element={<ResertPassword />} />  
                </Routes>  
            
            <Toaster />  
        </div>  
    );  
}  

export default App;