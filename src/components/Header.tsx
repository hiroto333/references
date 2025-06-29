"use client"

import { Button } from "../components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { LogOutIcon, UserIcon } from "lucide-react"
import { toast } from "sonner"

export default function Header() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    toast.success("ログアウトしました")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-blue-800">りふぁまる</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <UserIcon className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOutIcon className="h-4 w-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </div>
    </header>
  )
}
