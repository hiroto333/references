"use client"

import { useState } from "react"
import { type ReferenceData, ReferenceType } from "../types/reference"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { CopyIcon, CheckIcon, SaveIcon } from "lucide-react"
import { Alert, AlertDescription } from "../components/ui/alert"
import { toast } from "sonner"
import { useReferences } from "../hooks/useReferences"

interface ReferenceResultProps {
  data: ReferenceData
}

export default function ReferenceResult({ data }: ReferenceResultProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const { saveReference } = useReferences()

  const formatReference = (data: ReferenceData): string => {
    const authorList = data.authors
      .split(",")
      .map((author) => author.trim())
      .join("，")

    switch (data.type) {
      case ReferenceType.RESEARCH_REPORT:
        return `${authorList}：${data.title}，${data.publisher}，Vol.${data.volume}, No.${data.number}, pp.${data.pages} (${data.year})．`

      case ReferenceType.JOURNAL:
        return `${authorList}：${data.title}，${data.publisher}，Vol.${data.volume}, No.${data.number}, pp.${data.pages}(${data.year})．`

      case ReferenceType.BOOK:
        return `${authorList}：${data.title}，${data.bookPublisher} (${data.year})．`

      case ReferenceType.URL:
        const formattedDate = data.accessDate ? formatDate(data.accessDate) : ""
        return `${authorList}：${data.title}，入手先 "${data.url}" (${formattedDate} 確認)．`

      default:
        return "参考文献形式の変換に失敗しました。"
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}.${month}.${day}`
  }

  const formattedText = formatReference(data)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedText).then(() => {
      setCopied(true)
      toast("コピー完了", {
        description: "クリップボードにコピーしました",
        duration: 2000,
      })
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSave = async () => {
    const result = await saveReference(data, formattedText)
    if (result.success) {
      setSaved(true)
      toast.success("保存完了", {
        description: "参考文献を保存しました",
        duration: 2000,
      })
      setTimeout(() => setSaved(false), 3000)
    } else {
      toast.error("保存に失敗しました", {
        description: result.error,
        duration: 3000,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-800">変換結果</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <AlertDescription className="font-mono text-lg break-words">{formattedText}</AlertDescription>
        </Alert>

        <div className="flex space-x-2">
          <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
            {copied ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                コピーしました
              </>
            ) : (
              <>
                <CopyIcon className="mr-2 h-4 w-4" />
                クリップボードにコピー
              </>
            )}
          </Button>

          <Button onClick={handleSave} variant="default" className="flex-1" disabled={saved}>
            {saved ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                保存済み
              </>
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                参考文献を保存
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
