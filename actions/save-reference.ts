"use server"

import { supabase } from "../src/lib/supabase"
import type { ReferenceData } from "../src/types/reference"

export async function saveReference(data: ReferenceData, formattedText: string) {
  try {
    const { data: result, error } = await supabase
      .from("user_references")
      .insert({
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

    return { success: true, data: result }
  } catch (error) {
    console.error("Error saving reference:", error)
    return { success: false, error: "データベースエラーが発生しました" }
  }
}

export async function getReferences() {
  try {
    const { data, error } = await supabase.from("user_references").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching references:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching references:", error)
    return { success: false, error: "データベースエラーが発生しました" }
  }
}

export async function deleteReference(id: string) {
  try {
    const { error } = await supabase.from("user_references").delete().eq("id", id)

    if (error) {
      console.error("Error deleting reference:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting reference:", error)
    return { success: false, error: "データベースエラーが発生しました" }
  }
}
