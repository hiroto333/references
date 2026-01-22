"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Checkbox } from "../components/ui/checkbox"
import { CopyIcon, TrashIcon, CheckIcon, RefreshCwIcon, BookIcon, GripVerticalIcon } from "lucide-react"
import { useReferences } from "../hooks/useReferences"
import { toast } from "sonner"
import { Alert, AlertDescription } from "../components/ui/alert"

export default function ReferenceList() {
  const { references, loading, deleteReference, loadReferences } = useReferences()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(references.map((ref) => ref.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectReference = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleCopySelected = () => {
    const selectedReferences = references.filter((ref) => selectedIds.has(ref.id))
    const formattedText = selectedReferences.map((ref, index) => `[${index + 1}] ${ref.formatted_text}`).join("\n\n")

    navigator.clipboard.writeText(formattedText).then(() => {
      setCopied(true)
      toast.success("コピー完了", {
        description: `${selectedReferences.length}件の参考文献をコピーしました`,
      })
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDelete = async (id: string) => {
    const result = await deleteReference(id)
    if (result.success) {
      setSelectedIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      toast.success("参考文献を削除しました")
    } else {
      toast.error("削除に失敗しました", {
        description: result.error,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // ドラッグ＆ドロップハンドラー
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    // ビジュアルフィードバックのみ（ローカル状態の更新はドロップ時）
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) return

    // NOTE: 実際の順序変更はSupabaseにorder_indexカラムを追加する必要があります
    // 現時点ではビジュアルフィードバックのみ表示
    toast.info("並び替え機能", {
      description: "現在の実装ではローカルでの並び替えのみ対応しています",
    })
    setDraggedIndex(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCwIcon className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">読み込み中...</span>
      </div>
    )
  }

  if (references.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 dark:text-gray-400">
        <div className="mb-4">
          <BookIcon className="h-16 w-16 mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-medium mb-2">保存された参考文献がありません</h3>
        <p>フォームから参考文献を作成して保存してください。</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            id="select-all"
            checked={selectedIds.size === references.length}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium dark:text-gray-200">
            すべて選択 ({references.length}件)
          </label>
        </div>

        <div className="flex space-x-2">
          <Button onClick={loadReferences} variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            更新
          </Button>

          {selectedIds.size > 0 && (
            <Button onClick={handleCopySelected} variant="default" size="sm">
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                  コピー済み
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4 mr-2" />
                  選択項目をコピー ({selectedIds.size})
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {references.map((reference, index) => (
          <Card
            key={reference.id}
            className={`relative transition-all duration-200 ${draggedIndex === index ? "opacity-50 scale-[0.98]" : "hover:shadow-md"
              } dark:bg-gray-700/50`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {/* ドラッグハンドル */}
                  <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <GripVerticalIcon className="h-5 w-5" />
                  </div>
                  <Checkbox
                    checked={selectedIds.has(reference.id)}
                    onCheckedChange={(checked) => handleSelectReference(reference.id, checked as boolean)}
                  />
                  <div>
                    <CardTitle className="text-lg dark:text-gray-100">{reference.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary">{reference.type}</Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(reference.created_at)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleDelete(reference.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <Alert className="bg-gray-50 dark:bg-gray-800">
                <AlertDescription className="font-mono text-sm break-words dark:text-gray-200">
                  {reference.formatted_text}
                </AlertDescription>
              </Alert>

              <div className="mt-3 flex justify-end">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(reference.formatted_text)
                    toast.success("コピーしました")
                  }}
                  variant="outline"
                  size="sm"
                >
                  <CopyIcon className="h-4 w-4 mr-2" />
                  コピー
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
