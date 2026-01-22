"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { LogOutIcon, UserIcon, AlertCircleIcon, MoonIcon, SunIcon } from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"

export default function Header() {
  const { user, signOutWithCleanup, isAnonymous } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    if (isAnonymous) {
      toast.loading("ゲストデータを削除中...")
    }

    await signOutWithCleanup()

    if (isAnonymous) {
      toast.success("ゲストデータを削除してログアウトしました")
    } else {
      toast.success("ログアウトしました")
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400">りふぁまる</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            {mounted && theme === "dark" ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
            <span className="sr-only">テーマを切り替え</span>
          </Button>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <UserIcon className="h-4 w-4" />
            {isAnonymous ? (
              <div className="flex items-center space-x-2">
                <span>ゲストユーザー</span>
                <Badge variant="secondary" className="text-xs">
                  <AlertCircleIcon className="h-3 w-3 mr-1" />
                  一時的
                </Badge>
              </div>
            ) : (
              <span>{user?.email}</span>
            )}
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOutIcon className="h-4 w-4 mr-2" />
            {isAnonymous ? "データ削除してログアウト" : "ログアウト"}
          </Button>
        </div>
      </div>
    </header>
  )
}
