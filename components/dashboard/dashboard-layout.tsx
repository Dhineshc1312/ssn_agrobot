"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { signOutUser } from "@/lib/auth"
import { Sprout, Home, MapPin, BarChart3, Settings, User, LogOut, Menu, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Farms", href: "/dashboard/farms", icon: MapPin },
  { name: "Predictions", href: "/dashboard/predictions", icon: BarChart3 },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, profile } = useAuth()
  const typedUser = user as { photoURL?: string }
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOutUser()
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const userInitials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <div className="min-h-screen bg-green-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0 bg-white/95">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-2 px-6 border-b border-green-200">
              <div className="w-10 h-10 bg-gradient-to-br from-white-600 to-white-400 rounded-xl flex items-center justify-center shadow-lg">
              <img
                  src="/Gemini_Generated_Image_m87zpom87zpom87z-removebg-preview.png"
                  alt="Farmer using AI technology"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
            </div>
              <span className="text-lg font-semibold text-green-800">AgriForecast</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-green-200 bg-white/95 px-6">
          <div className="flex h-16 shrink-0 items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-white-600 to-white-400 rounded-xl flex items-center justify-center shadow-lg">
              <img
                  src="/Gemini_Generated_Image_m87zpom87zpom87z-removebg-preview.png"
                  alt="Farmer using AI technology"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
            </div>
            <span className="text-lg font-semibold text-green-800">AgriForecast</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-green-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="sm" className="hover:bg-green-100">
                <Bell className="h-5 w-5" />
                <span className="sr-only">View notifications</span>
              </Button>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-green-200" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={typedUser.photoURL ?? ""} alt={profile?.name ?? ""} />
                      <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.name}</p>
                      <p className="text-xs leading-none text-green-700">{profile?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}