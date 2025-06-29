"use client"

import { useEffect, useCallback } from "react"
import { supabase } from "../lib/supabase-client"
import { useAuth } from "@/contexts/AuthContext"

export function useGuestCleanup() {
  const { user, isAnonymous } = useAuth()

  const cleanupGuestData = useCallback(async () => {
    if (!user || !isAnonymous) return

    try {
      // 1. ユーザーの参考文献データを削除
      const { error: referencesError } = await supabase.from("user_references").delete().eq("user_id", user.id)

      if (referencesError) {
        console.error("Error deleting references:", referencesError)
      }

      // 2. 匿名ユーザーアカウントを削除
      // 注意: 匿名ユーザーは自動的に削除されるため、明示的な削除は不要
      // ただし、セッションをクリアする
      await supabase.auth.signOut()

      console.log("Guest data cleaned up successfully")
    } catch (error) {
      console.error("Error during cleanup:", error)
    }
  }, [user, isAnonymous])

  // ページを離れる時（タブを閉じる、ブラウザを閉じる時のみ）
  useEffect(() => {
    if (!isAnonymous || !user) return

    const handleBeforeUnload = () => {
      // ブラウザやタブを閉じる時のみクリーンアップを実行
      // navigator.sendBeacon を使用してより確実にデータを送信
      if (navigator.sendBeacon) {
        const cleanupUrl = `/api/cleanup-guest?userId=${user.id}`
        navigator.sendBeacon(cleanupUrl)
      } else {
        // フォールバック: 同期的にクリーンアップを実行
        cleanupGuestData()
      }
    }

    // beforeunloadイベントのみを使用（ブラウザ/タブを閉じる時）
    window.addEventListener("beforeunload", handleBeforeUnload)

    // クリーンアップ
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isAnonymous, user, cleanupGuestData])

  return { cleanupGuestData }
}
