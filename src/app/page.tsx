"use client"

import { useState } from "react"
import ReferenceForm from "../components/ReferenceForm"
import ReferenceResult from "../components/ReferenceResult"
import ReferenceList from "../components/ReferenceList"
import Header from "../components/Header"
import AuthForm from "../components/AuthForm"
import UrlFetcher from "../components/UrlFetcher"
import type { ReferenceData } from "../types/reference"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { BookIcon, FileTextIcon, LinkIcon, NewspaperIcon, AlertCircleIcon } from "lucide-react"
import { Toaster } from "../components/ui/sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useGuestCleanup } from "../hooks/useGuestCleanup"
import { Alert, AlertDescription } from "../components/ui/alert"

export default function Home() {
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null)
  const { user, loading, isAnonymous } = useAuth()

  // ゲストユーザーのクリーンアップフックを使用
  useGuestCleanup()

  const handleFormSubmit = (data: ReferenceData) => {
    setReferenceData(data)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                研究報告、論文誌、書籍、URLを簡単に引用形式に変換。伊藤研指定の参考文献形式に対応。
              </p>
            </div>

            {/* 匿名ユーザー向けの注意書き */}
            {isAnonymous && (
              <div className="max-w-7xl mx-auto mb-6">
                <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>
                    <strong>ゲストモードで利用中</strong>
                    <br />
                    データはブラウザセッション中のみ保存されます。ログアウトやタブを閉じると自動的にデータが削除されます。
                    <br />
                    永続的に保存したい場合は、メールアドレスでアカウントを作成してください。
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* 2カラムレイアウト */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
              {/* 左: 入力タブ */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                  <Tabs defaultValue="form" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="form" className="flex items-center gap-2">
                        <FileTextIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">フォームで入力</span>
                      </TabsTrigger>
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">URLから取得</span>
                      </TabsTrigger>
                      <TabsTrigger value="pdf" className="flex items-center gap-2" disabled>
                        <NewspaperIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">PDFから取得</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="form">
                      <ReferenceForm onSubmit={handleFormSubmit} />

                      {referenceData && (
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                          <ReferenceResult data={referenceData} />
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="url">
                      <UrlFetcher />
                    </TabsContent>

                    <TabsContent value="pdf">
                      <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <NewspaperIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">PDFから自動取得</h3>
                        <p>この機能は近日公開予定です。</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* 右: 参考文献一覧 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <BookIcon className="h-5 w-5 text-blue-800 dark:text-blue-400" />
                    <h2 className="text-xl font-bold text-blue-800 dark:text-blue-400">参考文献一覧</h2>
                  </div>
                  <ReferenceList />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
