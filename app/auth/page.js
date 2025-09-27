"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { OTPVerification } from "@/components/auth/otp-verification"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

export default function AuthPage() {
  const [currentView, setCurrentView] = useState("login") // 'login', 'register', 'otp'
  const [userEmail, setUserEmail] = useState("")

  const handleLoginSuccess = (email) => {
    setUserEmail(email)
    setCurrentView("otp")
  }

  const handleRegisterSuccess = (email) => {
    setUserEmail(email)
    setCurrentView("otp")
  }

  const handleOTPSuccess = () => {
    // Redirect to appropriate dashboard based on user role
    window.location.href = "/student" // Default to student, will be determined by backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>

        {/* Logo and Welcome */}
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-3xl font-bold font-display text-primary">Rural Learning</h1>
          <p className="text-muted-foreground text-lg">Learn anywhere, anytime</p>
        </div>

        {/* Auth Forms */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl font-display">
              {currentView === "login" && "Welcome Back"}
              {currentView === "register" && "Join Our Learning Community"}
              {currentView === "otp" && "Verify Your Account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentView === "login" && (
              <LoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setCurrentView("register")} />
            )}
            {currentView === "register" && (
              <RegisterForm onSuccess={handleRegisterSuccess} onSwitchToLogin={() => setCurrentView("login")} />
            )}
            {currentView === "otp" && (
              <OTPVerification email={userEmail} onSuccess={handleOTPSuccess} onBack={() => setCurrentView("login")} />
            )}
          </CardContent>
        </Card>

        {/* Audio Help Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="lg"
            className="audio-indicator"
            onClick={() => {
              const text =
                currentView === "login"
                  ? "Welcome back! Please enter your phone number and password to continue learning."
                  : currentView === "register"
                    ? "Join our learning community! We need guardian permission and your details to get started."
                    : "Please enter the verification code sent to your phone."

              if ("speechSynthesis" in window) {
                const utterance = new SpeechSynthesisUtterance(text)
                utterance.rate = 0.8
                utterance.pitch = 1.1
                speechSynthesis.speak(utterance)
              }
            }}
          >
            🔊 Listen to Instructions
          </Button>
        </div>
      </div>
    </div>
  )
}
