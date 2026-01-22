"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LinkIcon, Loader2Icon, AlertCircleIcon, CheckCircleIcon } from "lucide-react"
import { toast } from "sonner"
import { useReferences } from "../hooks/useReferences"
import { ReferenceType, type ReferenceData } from "../types/reference"

interface UrlMetadata {
    title: string
    authors: string
    year: string
    url: string
    accessDate: string
}

export default function UrlFetcher() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [metadata, setMetadata] = useState<UrlMetadata | null>(null)
    const { saveReference } = useReferences()

    const getTodayDate = () => {
        const today = new Date()
        return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
    }

    const handleFetchUrl = async () => {
        if (!url.trim()) {
            toast.error("URLを入力してください")
            return
        }

        setLoading(true)
        setMetadata(null)

        try {
            const response = await fetch("/api/fetch-url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            })

            if (!response.ok) {
                throw new Error("URLの取得に失敗しました")
            }

            const data = await response.json()
            setMetadata({
                title: data.title || "",
                authors: data.authors || "",
                year: data.year || new Date().getFullYear().toString(),
                url: url,
                accessDate: getTodayDate(),
            })

            toast.success("メタデータを取得しました")
        } catch (error) {
            console.error("Fetch error:", error)
            toast.error("URLからのデータ取得に失敗しました")
        } finally {
            setLoading(false)
        }
    }

    const formatReference = (meta: UrlMetadata): string => {
        const authorList = meta.authors
            .split(",")
            .map((author) => author.trim())
            .join("，")

        return `${authorList}：${meta.title}，入手先 "${meta.url}" (${meta.accessDate} 確認)．`
    }

    const handleSaveReference = async () => {
        if (!metadata) return

        const referenceData: ReferenceData = {
            type: ReferenceType.URL,
            authors: metadata.authors,
            title: metadata.title,
            url: metadata.url,
            accessDate: metadata.accessDate,
            year: metadata.year,
        }

        const formattedText = formatReference(metadata)
        const result = await saveReference(referenceData, formattedText)

        if (result.success) {
            toast.success("参考文献を保存しました")
            setMetadata(null)
            setUrl("")
        } else {
            toast.error("保存に失敗しました", {
                description: result.error,
            })
        }
    }

    return (
        <div className="space-y-6">
            <Card className="dark:bg-gray-700/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        URLから参考文献を取得
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://example.com/article"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={loading}
                                className="dark:bg-gray-800"
                            />
                            <Button onClick={handleFetchUrl} disabled={loading || !url.trim()}>
                                {loading ? (
                                    <>
                                        <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                                        取得中...
                                    </>
                                ) : (
                                    "取得"
                                )}
                            </Button>
                        </div>
                    </div>

                    {metadata && (
                        <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-4">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircleIcon className="h-5 w-5" />
                                <span className="font-medium">メタデータを取得しました</span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="meta-title">タイトル</Label>
                                    <Input
                                        id="meta-title"
                                        value={metadata.title}
                                        onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                        className="dark:bg-gray-700"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="meta-authors">著者</Label>
                                    <Input
                                        id="meta-authors"
                                        value={metadata.authors}
                                        onChange={(e) => setMetadata({ ...metadata, authors: e.target.value })}
                                        placeholder="著者名（カンマ区切り）"
                                        className="dark:bg-gray-700"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="meta-year">年</Label>
                                        <Input
                                            id="meta-year"
                                            value={metadata.year}
                                            onChange={(e) => setMetadata({ ...metadata, year: e.target.value })}
                                            className="dark:bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="meta-accessDate">参照日</Label>
                                        <Input
                                            id="meta-accessDate"
                                            value={metadata.accessDate}
                                            onChange={(e) => setMetadata({ ...metadata, accessDate: e.target.value })}
                                            className="dark:bg-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-mono break-all">{formatReference(metadata)}</p>
                            </div>

                            <Button onClick={handleSaveReference} className="w-full">
                                参考文献として保存
                            </Button>
                        </div>
                    )}

                    {!metadata && !loading && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <AlertCircleIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>URLを入力して「取得」をクリックしてください</p>
                            <p className="text-sm mt-1">Webページのタイトルやメタ情報を自動取得します</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
