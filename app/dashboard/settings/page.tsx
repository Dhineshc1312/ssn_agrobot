"use client"
import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api"

export default function SettingsPage() {
  // Profile info
  const [username, setUsername] = useState("john_doe")
  const [email, setEmail] = useState("john@example.com")

  // Password update
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Notification preferences (example)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  // Theme selection
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Save button loading state
  const [isSaving, setIsSaving] = useState(false)

  // Validation for password change
  const validatePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSave = async () => {
    if (newPassword || confirmPassword) {
      if (!validatePasswordChange()) return
    }

    setIsSaving(true)
    try {
      // Update profile (username and email)
      await apiClient.updateProfile({ name: username, email })

      // Note: Password change currently requires Firebase client SDK integration or backend endpoint.
      // Placeholder for future changePassword API call:
      // if (currentPassword && newPassword) {
      //   await apiClient.changePassword({
      //     current_password: currentPassword,
      //     new_password: newPassword,
      //   })
      // }

      alert("Settings saved successfully")
      // Clear sensitive fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordError("")
    } catch (error: any) {
      alert("Error saving settings: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>Manage your profile and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSave()
            }}
            className="space-y-4"
          >
            {/* Username */}
            <div>
              <Label htmlFor="username" className="mb-1 block font-medium">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-1 block font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password fields */}
            <div>
              <Label htmlFor="currentPassword" className="mb-1 block font-medium">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="mb-1 block font-medium">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="mb-1 block font-medium">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              {passwordError && (
                <p className="text-destructive text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Notification preferences */}
            <div className="pt-4 border-t border-muted">
              <Label className="mb-2 block font-medium">Notification Preferences</Label>
              <label className="inline-flex items-center cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="form-checkbox h-5 w-5 text-primary"
                />
                <span className="ml-2">Email Notifications</span>
              </label>
              <br />
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={() => setSmsNotifications(!smsNotifications)}
                  className="form-checkbox h-5 w-5 text-primary"
                />
                <span className="ml-2">SMS Notifications</span>
              </label>
            </div>

            {/* Theme selection */}
            <div className="pt-4 border-t border-muted">
              <Label className="mb-2 block font-medium">Theme</Label>
              <div className="flex gap-4">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  type="button"
                >
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  type="button"
                >
                  Dark
                </Button>
              </div>
            </div>

            {/* Save button */}
            <div className="pt-6">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


