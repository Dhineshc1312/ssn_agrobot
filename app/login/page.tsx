"use client"

import { motion } from "framer-motion"
import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-300 p-6">
      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl" // <-- The width has been increased here.
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-200">
          <AuthLayout
            title="🌱 Welcome Back"
            subtitle="Sign in to AgriForecast to manage your farm insights & predictions"
          >
            <LoginForm />
          </AuthLayout>
        </div>
      </motion.div>
    </div>
  )
}