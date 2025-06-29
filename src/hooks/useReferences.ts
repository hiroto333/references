"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase-client"
import type { ReferenceData } from "../types/reference"
import { useAuth } from "@/contexts/AuthContext"

interface Reference {
  id: string
  user_id: string
  type: string
  authors: string
  title: string
  formatted_text: string
  created_at: string
}

export function useReferences() {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadReferences = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("user_references")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching references:", error)
        return { success: false, error: error.message }
      }

      setReferences(data || [])
      return { success: true, data }
    } catch (error) {
      console.error("Error fetching references:", error)
      return { success: false, error: "データベースエラーが発生しました" }
    } finally {
      setLoading(false)
    }
  }

  const saveReference = async (data: ReferenceData, formattedText: string) => {
    if (!user) {
      return { success: false, error: "認証が必要です" }
    }

    try {
      const { data: result, error } = await supabase
        .from("user_references")
        .insert({
          user_id: user.id,
          type: data.type,
          authors: data.authors,
          title: data.title,
          publisher: data.publisher || null,
          volume: data.volume || null,
          number: data.number || null,
          pages: data.pages || null,
          year: data.year || null,
          book_publisher: data.bookPublisher || null,
          url: data.url || null,
          access_date: data.accessDate || null,
          formatted_text: formattedText,
        })
        .select()
        .single()

      if (error) {
        console.error("Error saving reference:", error)
        return { success: false, error: error.message }
      }

      // ローカル状態を更新
      await loadReferences()
      return { success: true, data: result }
    } catch (error) {
      console.error("Error saving reference:", error)
      return { success: false, error: "データベースエラーが発生しました" }
    }
  }

  const deleteReference = async (id: string) => {
    if (!user) {
      return { success: false, error: "認証が必要です" }
    }

    try {
      const { error } = await supabase.from("user_references").delete().eq("id", id).eq("user_id", user.id)

      if (error) {
        console.error("Error deleting reference:", error)
        return { success: false, error: error.message }
      }

      // ローカル状態を更新
      setReferences((prev) => prev.filter((ref) => ref.id !== id))
      return { success: true }
    } catch (error) {
      console.error("Error deleting reference:", error)
      return { success: false, error: "データベースエラーが発生しました" }
    }
  }

  useEffect(() => {
    if (user) {
      loadReferences()
    }
  }, [user])

  return {
    references,
    loading,
    saveReference,
    deleteReference,
    loadReferences,
  }
}
