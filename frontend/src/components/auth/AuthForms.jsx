"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { authApi } from "../../services/apiService"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import OtpVerification from "./OtpVerification"
import PasswordSetup from "./PasswordSetup"

// Removed TypeScript type definition for compatibility with plain JavaScript

export default function AuthForms({ formType = "login" }) {
  const [currentStep, setCurrentStep] = useState(formType)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    otp: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSendOTP = async () => {
    try {
      const response = await authApi.sendOtp(formData.email);
      if (response.message) {
        setCurrentStep("otp");
      } else {
        alert("Failed to send OTP: " + response.error);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("An error occurred while sending OTP.");
    }
  }

  const handleVerifyOTP = async () => {
    try {
      const response = await authApi.confirmOtp(formData.email, formData.otp);
      if (response.message) {
        setCurrentStep("password");
      } else {
        alert("OTP verification failed: " + response.error);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred while verifying OTP.");
    }
  }

  const handleRegister = async () => {
    try {
      const response = await authApi.register(formData.email, formData.password, formData.birthDate || "");
      if (response.message) {
        alert("Registration completed successfully!");
        setCurrentStep("login");
      } else {
        alert("Registration failed: " + response.errors);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#0D0D0D" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="../src/assets/favicon/favicon.png"
            alt="Quiz-Ziup Logo"
            className="inline-block mb-4" // Removed h-12 and w-auto
            style={{
              width: "64px",  // Set a fixed width
              height: "64px", // Set a fixed height
              borderRadius: "16px", // Slightly larger radius for the new size
              objectFit: "cover",
              backgroundColor: "transparent",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          />
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              background: "linear-gradient(135deg, #9333EA 0%, #DB2777 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Quiz-Ziup
          </h1>
          <p style={{ color: "#CCCCCC" }}>
            {currentStep === "login" && "Welcome back! Sign in to continue"}
            {currentStep === "register" && "Create your account"}
            {currentStep === "otp" && "Verify your phone number"}
            {currentStep === "password" && "Set your password"}
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: "#1A1A1A",
            borderColor: "#444444",
          }}
        >
          {/* Back Button for multi-step flows */}
          {currentStep !== "login" && currentStep !== "register" && (
            <button
              onClick={() => {
                if (currentStep === "otp") setCurrentStep("register")
                if (currentStep === "password") setCurrentStep("otp")
              }}
              className="flex items-center gap-2 mb-6 text-sm transition-colors"
              style={{ color: "#CCCCCC" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F5")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#CCCCCC")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Login Form */}
          {currentStep === "login" && (
            <LoginForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
              setCurrentStep={setCurrentStep} 
            />
          )}

          {/* Register Form */}
          {currentStep === "register" && (
            <RegisterForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
              setCurrentStep={setCurrentStep} 
              handleSendOTP={handleSendOTP} 
            />
          )}

          {/* OTP Verification */}
          {currentStep === "otp" && (
            <OtpVerification 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleVerifyOTP={handleVerifyOTP} 
            />
          )}

          {/* Password Setup */}
          {currentStep === "password" && (
            <PasswordSetup 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleRegister={handleRegister} 
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: "#888888" }}>
            By continuing, you agree to our{" "}
            <button className="underline transition-colors" style={{ color: "#2563EB" }}>
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="underline transition-colors" style={{ color: "#2563EB" }}>
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
