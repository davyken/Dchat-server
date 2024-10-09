import React, { useState, useContext } from "react";
import axios from "axios";
import { useAuthProvider } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import VerificationForm from "../../components/authcomponents/VerificationForm";
import AuthForm from "../../components/authcomponents/AuthForm";
import AuthToggle from "../../components/authcomponents/AuthToggle";
import ForgotPassword from "../../components/authcomponents/ForgotPassword";

const Auth = () => {
  const { login } = useAuthProvider();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [isVerification, setIsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const toggleAuthMode = () => {
    console.log("Toggling authentication mode");
    setIsSignup(!isSignup);
    setIsVerification(false);
  };

  const handleInputChange = (event) => {
    console.log("Handling input change for field", event.target.name);
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleVerificationCodeChange = (event, index) => {
    const value = event.target.value;
    console.log("Handling verification code change", index, value);
    if (value && /^\d$/.test(value)) {
      const newVerificationCode = verificationCode.split("");
      newVerificationCode[index] = value;
      setVerificationCode(newVerificationCode.join(""));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Handling form submission");
    try {
      let url = isSignup
        ? "http://localhost:3000/auth/register"
        : "http://localhost:3000/auth/login";
      const response = await axios.post(url, formData);
      console.log("Form submission successful", response.data);
      if (isSignup) {
        setIsVerification(true);
      } else {
        login(response.data);
      }
    } catch (error) {
      console.error("Form submission failed", error);

      setFormErrors(error.response?.data?.errors || {});
    }
  };

  const handleVerify = async () => {
    try {
      console.log("Handling email verification", verificationCode);
      const response = await axios.post(
        "http://localhost:3000/auth/verify-email",
        {
          email: formData.email,
          verificationCode,
        }
      );
      console.log("Email verification successful", response.data);
      login(response.data);
    } catch (error) {
      console.error("Email verification failed", error);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-4 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center text-blue-500">
        {isSignup ? "Sign Up" : "Sign In"}
      </h2>
      {isVerification ? (
        <VerificationForm
          verificationCode={verificationCode}
          handleVerificationCodeChange={handleVerificationCodeChange}
          handleVerify={handleVerify}
        />
      ) : (
        <AuthForm
          isSignup={isSignup}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          formErrors={formErrors}
        />
      )}
      <AuthToggle isSignup={isSignup} toggleAuthMode={toggleAuthMode} />
      <ForgotPassword />
    </div>
  );
};

export default Auth;
