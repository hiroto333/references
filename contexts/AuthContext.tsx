"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../src/lib/supabase"
import type { User, AuthError } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInAnonymously: () => Promise<{ error: AuthError | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  signOutWithCleanup: () => Promise<void>
  isAnonymous: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAnonymous = user?.is_anonymous ?? false

  useEffect(() => {
    // 初期認証状態を取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInAnonymously = async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInAnonymously()
    return { error }
  }

  const signInWithEmail = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut()
  }

  const signOutWithCleanup = async (): Promise<void> => {
    if (user && isAnonymous) {
      try {
        // 1. ユーザーの参考文献データを削除
        await supabase.from("user_references").delete().eq("user_id", user.id)

        // 2. サインアウト
        await supabase.auth.signOut()

        console.log("Guest data cleaned up on logout")
      } catch (error) {
        console.error("Error during cleanup on logout:", error)
        // エラーが発生してもサインアウトは実行
        await supabase.auth.signOut()
      }
    } else {
      // 通常のユーザーは普通にサインアウト
      await supabase.auth.signOut()
    }
  }

  const value = {
    user,
    loading,
    signInAnonymously,
    signInWithEmail,
    signUp,
    signOut,
    signOutWithCleanup,
    isAnonymous,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
