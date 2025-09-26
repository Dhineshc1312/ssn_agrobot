import React from "react"

import type { ReactNode } from "react"
import { Sprout } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-white-600 to-white-400 rounded-xl flex items-center justify-center shadow-lg">
              <img
                  src="/Gemini_Generated_Image_m87zpom87zpom87z-removebg-preview.png"
                  alt="Farmer using AI technology"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
            </div>
              <span className="text-2xl font-bold text-foreground">AgriForecast</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">{title}</h1>
          <p className="text-muted-foreground text-balance">{subtitle}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">{children}</div>
      </div>
    </div>
  )
}
