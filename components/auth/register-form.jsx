"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    studentName: "",
    guardianName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    guardianConsent: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validation
      if (!formData.guardianConsent) {
        setError("Guardian consent is required for registration")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onSuccess(formData.phone)
    } catch (err) {
      setError("Registration failed. Please try again.")
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
          <Label htmlFor="studentName" className="text-base font-medium">
            Student Name
          </Label>
          <Input
            id="studentName"
            type="text"
            placeholder="Enter student's name"
            value={formData.studentName}
            onChange={(e) => handleInputChange("studentName", e.target.value)}
            className="h-12 text-lg"
            required
          />
        </div>

        <div>
          <Label htmlFor="guardianName" className="text-base font-medium">
            Guardian Name
          </Label>
          <Input
            id="guardianName"
            type="text"
            placeholder="Enter guardian's name"
            value={formData.guardianName}
            onChange={(e) => handleInputChange("guardianName", e.target.value)}
            className="h-12 text-lg"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
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
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="h-12 text-lg"
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-base font-medium">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="h-12 text-lg"
            required
          />
        </div>

        <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg">
          <Checkbox
            id="guardianConsent"
            checked={formData.guardianConsent}
            onCheckedChange={(checked) => handleInputChange("guardianConsent", checked)}
            className="mt-1"
          />
          <div>
            <Label htmlFor="guardianConsent" className="text-sm font-medium leading-relaxed">
              Guardian Consent Required
            </Label>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              I, as the guardian, give permission for this child to use the learning platform and agree to supervise
              their learning activities.
            </p>
          </div>
        </div>
      </div>

      {error && <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full h-12 text-lg font-medium" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center">
        <button type="button" onClick={onSwitchToLogin} className="text-primary hover:underline text-base">
          Already have an account? Sign in here
        </button>
      </div>
    </form>
  )
}
