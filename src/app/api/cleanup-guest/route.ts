import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // ユーザーの参考文献データを削除
    const { error: referencesError } = await supabase.from("user_references").delete().eq("user_id", userId)

    if (referencesError) {
      console.error("Error deleting references:", referencesError)
      return NextResponse.json({ error: "Failed to delete references" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in cleanup API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // ユーザーの参考文献データを削除
    const { error: referencesError } = await supabase.from("user_references").delete().eq("user_id", userId)

    if (referencesError) {
      console.error("Error deleting references:", referencesError)
      return NextResponse.json({ error: "Failed to delete references" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in cleanup API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
