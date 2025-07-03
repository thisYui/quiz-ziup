"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { authApi } from "../../services/apiService"

// Removed TypeScript type definition for compatibility with plain JavaScript

export default function AuthForms() {
  const [currentStep, setCurrentStep] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
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

  const handleLogin = async () => {
    try {
      const deviceInfo = {
        device: navigator.platform,
        ip_address: "", // This would typically be fetched from an API or server-side
        user_agent: navigator.userAgent,
      };
      const response = await authApi.login(formData.email, formData.password, true, deviceInfo);
      if (response.message) {
        alert("Login successful!");
        // Optionally redirect or update app state here
      } else {
        alert("Login failed: " + response.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#0D0D0D" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="./src/assets/favicon/favicon.png"
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
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                    Email
                  </Label>
                  <div className="relative mt-1">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: "#888888" }}
                    />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 h-12 border-2 transition-all duration-200"
                      style={{
                        backgroundColor: "#2A2A2A",
                        borderColor: "#666666",
                        color: "#F5F5F5",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#2563EB"
                        e.target.style.boxShadow = "0 0 0 1px #2563EB"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#666666"
                        e.target.style.boxShadow = "none"
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: "#888888" }}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 h-12 border-2 transition-all duration-200"
                      style={{
                        backgroundColor: "#2A2A2A",
                        borderColor: "#666666",
                        color: "#F5F5F5",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#2563EB"
                        e.target.style.boxShadow = "0 0 0 1px #2563EB"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#666666"
                        e.target.style.boxShadow = "none"
                      }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#888888" }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2"
                    style={{
                      backgroundColor: "#2A2A2A",
                      borderColor: "#666666",
                      accentColor: "#2563EB",
                    }}
                  />
                  <span className="text-sm" style={{ color: "#CCCCCC" }}>
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm transition-colors"
                  style={{ color: "#2563EB" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#2563EB")}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full h-12 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #9333EA 0%, #DB2777 100%)",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(219,39,119,0.3)"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                Log In
              </Button>

              <div className="text-center">
                <span style={{ color: "#888888" }}>{"Don't have an account? "}</span>
                <button
                  onClick={() => setCurrentStep("register")}
                  className="font-semibold transition-colors"
                  style={{ color: "#2563EB" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#2563EB")}
                >
                  Sign up
                </button>
              </div>
            </div>
          )}

          {/* Register Form */}
          {currentStep === "register" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                    Full Name
                  </Label>
                  <div className="relative mt-1">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: "#888888" }}
                    />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 h-12 border-2 transition-all duration-200"
                      style={{
                        backgroundColor: "#2A2A2A",
                        borderColor: "#666666",
                        color: "#F5F5F5",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#2563EB"
                        e.target.style.boxShadow = "0 0 0 1px #2563EB"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#666666"
                        e.target.style.boxShadow = "none"
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                    Email
                  </Label>
                  <div className="relative mt-1">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: "#888888" }}
                    />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 h-12 border-2 transition-all duration-200"
                      style={{
                        backgroundColor: "#2A2A2A",
                        borderColor: "#666666",
                        color: "#F5F5F5",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#2563EB"
                        e.target.style.boxShadow = "0 0 0 1px #2563EB"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#666666"
                        e.target.style.boxShadow = "none"
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                    Phone Number
                  </Label>
                  <div className="relative mt-1">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: "#888888" }}
                    />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 h-12 border-2 transition-all duration-200"
                      style={{
                        backgroundColor: "#2A2A2A",
                        borderColor: "#666666",
                        color: "#F5F5F5",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#2563EB"
                        e.target.style.boxShadow = "0 0 0 1px #2563EB"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#666666"
                        e.target.style.boxShadow = "none"
                      }}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                className="w-full h-12 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(37,99,235,0.3)"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                Send OTP
              </Button>

              <div className="text-center">
                <span style={{ color: "#888888" }}>Already have an account? </span>
                <button
                  onClick={() => setCurrentStep("login")}
                  className="font-semibold transition-colors"
                  style={{ color: "#2563EB" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#2563EB")}
                >
                  Log in
                </button>
              </div>
            </div>
          )}

          {/* OTP Verification */}
          {currentStep === "otp" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#2A2A2A" }}
                >
                  <Phone className="w-8 h-8" style={{ color: "#2563EB" }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#F5F5F5" }}>
                  Verify Your Phone
                </h3>
                <p style={{ color: "#CCCCCC" }}>We've sent a 6-digit code to</p>
                <p className="font-semibold" style={{ color: "#2563EB" }}>
                  {formData.phone}
                </p>
              </div>

              <div>
                <Label htmlFor="otp" className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value)}
                  className="mt-1 h-12 text-center text-lg font-mono border-2 transition-all duration-200"
                  style={{
                    backgroundColor: "#2A2A2A",
                    borderColor: "#666666",
                    color: "#F5F5F5",
                    letterSpacing: "0.5em",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2563EB"
                    e.target.style.boxShadow = "0 0 0 1px #2563EB"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#666666"
                    e.target.style.boxShadow = "none"
                  }}
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full h-12 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(37,99,235,0.3)"
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                Verify Code
              </Button>

              <div className="text-center">
                <span style={{ color: "#888888" }}>{"Didn't receive the code? "}</span>
                <button
                  className="font-semibold transition-colors"
                  style={{ color: "#2563EB" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#2563EB")}
                >
                  Resend
                </button>
              </div>
            </div>
          )}

          {/* Password Setup */}
          {currentStep === "password" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#2A2A2A" }}
                >
                  <Lock className="w-8 h-8" style={{ color: "#9333EA" }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#F5F5F5" }}>
                  Set Your Password
                </h3>
                <p style={{ color: "#CCCCCC" }}>Create a secure password for your account</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-password" className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: "#888888" }}
                    />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 h-12 border-2 transition-all duration-200"
                      style={{
                        backgroundColor: "#2A2A2A",
                        borderColor: "#666666",
                        color: "#F5F5F5",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#2563EB"
                        e.target.style.boxShadow = "0 0 0 1px #2563EB"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#666666"
                        e.target.style.boxShadow = "none"
                      }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#888888" }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: "#888888" }}
                    />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 h-12 border-2 transition-all duration-200"
                      style={{
                        backgroundColor: "#2A2A2A",
                        borderColor:
                          formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? "#DC2626"
                            : "#666666",
                        color: "#F5F5F5",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#2563EB"
                        e.target.style.boxShadow = "0 0 0 1px #2563EB"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor =
                          formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? "#DC2626"
                            : "#666666"
                        e.target.style.boxShadow = "none"
                      }}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#888888" }}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm mt-1" style={{ color: "#DC2626" }}>
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                  Password requirements:
                </p>
                <ul className="text-sm space-y-1" style={{ color: "#888888" }}>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? "bg-green-500" : "bg-gray-500"}`}
                    ></div>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? "bg-green-500" : "bg-gray-500"}`}
                    ></div>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? "bg-green-500" : "bg-gray-500"}`}
                    ></div>
                    One number
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleRegister}
                disabled={
                  !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword
                }
                className="w-full h-12 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #9333EA 0%, #DB2777 100%)",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(219,39,119,0.3)"
                    e.currentTarget.style.transform = "translateY(-1px)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                Complete Registration
              </Button>
            </div>
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
