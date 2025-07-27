import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { authApi } from "../../services/apiService"

export default function LoginForm({ formData, handleInputChange, setCurrentStep }) {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [loginError, setLoginError] = useState(false)


    const handleLogin = async () => {
        try {
            const response = await authApi.login(formData.email, formData.password, rememberMe);
            if (response.user_id) {
                sessionStorage.setItem("user_id", response.user_id);
                navigate(`/${response.user_id}/home`);
            } else if (response.fail) {
                setLoginError(true);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login.");
        }
    }

    return (
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

            { loginError && (
                <div className="text-sm text-red-500 font-medium mb-2">
                    Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.
                </div>
            )}

            <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-2"
                        onChange={(e) => setRememberMe(e.target.checked)}
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
                    onClick={() => {
                        setCurrentStep("register");
                        navigate("/auth/register");
                    }}
                    className="font-semibold transition-colors cursor-pointer"
                    style={{ color: "#2563EB" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#14B8A6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#2563EB")}
                >
                    Sign up
                </button>
            </div>
        </div>
    )
}