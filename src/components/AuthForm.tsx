"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Alert, AlertDescription } from "../components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { LogInIcon, UserPlusIcon, UserIcon, InfoIcon } from "lucide-react"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signInAnonymously, signInWithEmail, signUp } = useAuth()

  const handleAnonymousSignIn = async () => {
    setLoading(true)
    const { error } = await signInAnonymously()

    if (error) {
      toast.error("ゲストログインに失敗しました", {
        description: error.message,
      })
    } else {
      toast.success("ゲストとしてログインしました")
    }
    setLoading(false)
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signInWithEmail(email, password)

    if (error) {
      toast.error("ログインに失敗しました", {
        description: error.message,
      })
    } else {
      toast.success("ログインしました")
    }

    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signUp(email, password)

    if (error) {
      toast.error("アカウント作成に失敗しました", {
        description: error.message,
      })
    } else {
      toast.success("アカウントを作成しました", {
        description: "すぐにログインできます",
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-blue-800">りふぁまる</h1>
          <p className="text-slate-600">参考文献を簡単に管理しましょう</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">ログイン</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ゲストログイン（推奨） */}
            <div className="space-y-3">
              <Button onClick={handleAnonymousSignIn} className="w-full" size="lg" disabled={loading}>
                <UserIcon className="mr-2 h-5 w-5" />
                {loading ? "ログイン中..." : "ゲストとして始める（推奨）"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                アカウント作成不要で今すぐ使えます
                <br />
                ※ブラウザを閉じるとデータが消える場合があります
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">または</span>
              </div>
            </div>

            {/* メールアドレスでのログイン */}
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" className="flex items-center gap-2">
                  <LogInIcon className="h-4 w-4" />
                  ログイン
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserPlusIcon className="h-4 w-4" />
                  新規登録
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">メールアドレス</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">パスワード</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="パスワードを入力"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-transparent" variant="outline" disabled={loading}>
                    {loading ? "ログイン中..." : "メールでログイン"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <Alert className="bg-blue-50 border-blue-200">
                    <InfoIcon className="h-4 w-4" />
                    <AlertDescription className="text-sm">アカウント作成後、すぐにログインできます。</AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">メールアドレス</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">パスワード</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="6文字以上のパスワード"
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-transparent" variant="outline" disabled={loading}>
                    {loading ? "作成中..." : "アカウント作成"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
