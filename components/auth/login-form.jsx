"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ onSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock validation
      if (formData.phone && formData.password) {
        onSuccess(formData.phone)
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="h-12 text-lg"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-base font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="h-12 text-lg"
            required
          />
        </div>
      </div>

      {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full h-12 text-lg font-medium" disabled={isLoading}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>

      <div className="text-center">
        <button type="button" onClick={onSwitchToRegister} className="text-primary hover:underline text-base">
          Don't have an account? Register here
        </button>
      </div>
    </form>
  )
}
