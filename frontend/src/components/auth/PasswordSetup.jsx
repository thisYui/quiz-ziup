import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function PasswordSetup({ formData, handleInputChange, handleRegister }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
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
  )
}