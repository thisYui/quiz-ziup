import { useNavigate } from "react-router-dom"
import { Mail, User, Phone } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function RegisterForm({ formData, handleInputChange, setCurrentStep, handleSendOTP }) {
  const navigate = useNavigate()

  return (
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
          onClick={() => {
            setCurrentStep("login");
            navigate("/auth/login");
          }}
          className="font-semibold transition-colors cursor-pointer"
          style={{ color: "#2563EB" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#2563EB")}
        >
          Log in
        </button>
      </div>
    </div>
  )
}