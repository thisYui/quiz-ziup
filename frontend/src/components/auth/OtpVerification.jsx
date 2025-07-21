import { Phone } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function OtpVerification({ formData, handleInputChange, handleVerifyOTP }) {
  return (
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
  )
}