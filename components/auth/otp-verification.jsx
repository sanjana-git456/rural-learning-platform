"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function OTPVerification({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (otp.length !== 6) {
        setError("Please enter a 6-digit verification code")
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock validation - accept any 6-digit code for demo
      if (otp.length === 6) {
        onSuccess()
      } else {
        setError("Invalid verification code")
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setCanResend(false)
    setTimeLeft(300)
    setError("")

    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Show success message (in real app, this would be a toast)
    alert("Verification code sent!")
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">We've sent a 6-digit verification code to</p>
        <p className="font-medium text-primary">{email}</p>
      </div>

      <div>
        <Label htmlFor="otp" className="text-base font-medium">
          Verification Code
        </Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6)
            setOtp(value)
            if (error) setError("")
          }}
          className="h-12 text-lg text-center tracking-widest"
          maxLength={6}
          required
        />
      </div>

      {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full h-12 text-lg font-medium" disabled={isLoading || otp.length !== 6}>
        {isLoading ? "Verifying..." : "Verify Account"}
      </Button>

      <div className="text-center space-y-2">
        {!canResend ? (
          <p className="text-sm text-muted-foreground">Resend code in {formatTime(timeLeft)}</p>
        ) : (
          <Button type="button" variant="ghost" onClick={handleResendOTP} className="text-primary hover:underline">
            Resend Verification Code
          </Button>
        )}

        <div>
          <Button type="button" variant="ghost" onClick={onBack} className="text-muted-foreground hover:underline">
            Back to Login
          </Button>
        </div>
      </div>
    </form>
  )
}
