"use client"

import type React from "react"

import { useState } from "react"
import { type ReferenceData, ReferenceType } from "../types/reference"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Calendar } from "../components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { cn } from "../lib/utils"

interface ReferenceFormProps {
  onSubmit: (data: ReferenceData) => void
}

export default function ReferenceForm({ onSubmit }: ReferenceFormProps) {
  const [type, setType] = useState<string>(ReferenceType.RESEARCH_REPORT)
  const [authors, setAuthors] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [publisher, setPublisher] = useState<string | undefined>("")
  const [volume, setVolume] = useState<string | undefined>("")
  const [number, setNumber] = useState<string | undefined>("")
  const [pages, setPages] = useState<string | undefined>("")
  const [year, setYear] = useState<string | undefined>("")
  const [bookPublisher, setBookPublisher] = useState<string | undefined>("")
  const [url, setUrl] = useState<string | undefined>("")
  const [accessDate, setAccessDate] = useState<Date | undefined>(undefined)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const data: ReferenceData = {
      type: type,
      authors: authors,
      title: title,
      publisher: publisher || null,
      volume: volume || null,
      number: number || null,
      pages: pages || null,
      year: year || null,
      bookPublisher: bookPublisher || null,
      url: url || null,
      accessDate: accessDate ? accessDate.toISOString() : null,
    }

    onSubmit(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>参考文献フォーム</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">種類</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="種類を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ReferenceType.RESEARCH_REPORT}>研究報告</SelectItem>
                <SelectItem value={ReferenceType.JOURNAL}>論文誌</SelectItem>
                <SelectItem value={ReferenceType.BOOK}>書籍</SelectItem>
                <SelectItem value={ReferenceType.URL}>URL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="authors">著者</Label>
            <Input type="text" id="authors" value={authors} onChange={(e) => setAuthors(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="title">タイトル</Label>
            <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {type === ReferenceType.RESEARCH_REPORT || type === ReferenceType.JOURNAL ? (
            <>
              <div>
                <Label htmlFor="publisher">出版社/雑誌名</Label>
                <Input
                  type="text"
                  id="publisher"
                  value={publisher || ""}
                  onChange={(e) => setPublisher(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="volume">巻</Label>
                <Input type="text" id="volume" value={volume || ""} onChange={(e) => setVolume(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="number">号</Label>
                <Input type="text" id="number" value={number || ""} onChange={(e) => setNumber(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="pages">ページ</Label>
                <Input type="text" id="pages" value={pages || ""} onChange={(e) => setPages(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="year">出版年</Label>
                <Input type="text" id="year" value={year || ""} onChange={(e) => setYear(e.target.value)} />
              </div>
            </>
          ) : type === ReferenceType.BOOK ? (
            <div>
              <Label htmlFor="bookPublisher">出版社</Label>
              <Input
                type="text"
                id="bookPublisher"
                value={bookPublisher || ""}
                onChange={(e) => setBookPublisher(e.target.value)}
              />
            </div>
          ) : type === ReferenceType.URL ? (
            <>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input type="url" id="url" value={url || ""} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <div>
                <Label>アクセス日</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !accessDate && "text-muted-foreground",
                      )}
                    >
                      {accessDate ? new Date(accessDate).toLocaleDateString("ja-JP") : <span>日付を選択</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={accessDate}
                      onSelect={setAccessDate}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          ) : null}

          <Button type="submit">変換</Button>
        </form>
      </CardContent>
    </Card>
  )
}
