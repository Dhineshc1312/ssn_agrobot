"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase"

interface LocalUser {
  uid: string
  email: string | null
  displayName: string | null
}

interface AuthContextType {
  user: LocalUser | null
  profile: any | null
  loading: boolean
  refreshProfile: () => Promise<void>
  firebaseConfigured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseConfigured, setFirebaseConfigured] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFirebaseConfigured(isFirebaseConfigured())
    }
  }, [])

  const refreshProfile = async () => {
    if (!user || !firebaseConfigured) return

    const db = getFirebaseDb()
    if (!db) return

    try {
      const docRef = db.collection("users").doc(user.uid)
      const docSnap = await docRef.get()

      if (docSnap.exists) {
        setProfile(docSnap.data())
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!firebaseConfigured) {
      throw new Error("Firebase is not configured")
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      throw new Error("Firebase Auth is not available")
    }

    try {
      const result = await auth.signInWithEmailAndPassword(email, password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw new Error(error.message || "Failed to sign in")
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!firebaseConfigured) {
      throw new Error("Firebase is not configured")
    }

    const auth = getFirebaseAuth()
    const db = getFirebaseDb()
    if (!auth || !db) {
      throw new Error("Firebase services are not available")
    }

    try {
      const result = await auth.createUserWithEmailAndPassword(email, password)

      if (result.user) {
        // Create user profile in Firestore
        await db.collection("users").doc(result.user.uid).set({
          uid: result.user.uid,
          name: name,
          email: email,
          role: "farmer",
          createdAt: new Date().toISOString(),
        })
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw new Error(error.message || "Failed to create account")
    }
  }

  const signOut = async () => {
    if (!firebaseConfigured) {
      setUser(null)
      setProfile(null)
      router.push("/login")
      return
    }

    const auth = getFirebaseAuth()
    if (!auth) return

    try {
      await auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined" || !firebaseConfigured) {
      setLoading(false)
      return
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const localUser: LocalUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        }
        setUser(localUser)

        // Fetch user profile
        const db = getFirebaseDb()
        if (db) {
          try {
            const docRef = db.collection("users").doc(firebaseUser.uid)
            const docSnap = await docRef.get()

            if (docSnap.exists) {
              setProfile(docSnap.data())
            }
          } catch (error) {
            console.error("Error fetching user profile:", error)
          }
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [firebaseConfigured])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile,
        firebaseConfigured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


