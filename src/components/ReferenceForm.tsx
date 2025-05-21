'use client';

import { useState } from 'react';
import { ReferenceData, ReferenceType } from '../types/reference';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface ReferenceFormProps {
  onSubmit: (data: ReferenceData) => void;
}

export default function ReferenceForm({ onSubmit }: ReferenceFormProps) {
  const [referenceType, setReferenceType] = useState<ReferenceType>(ReferenceType.RESEARCH_REPORT);
  const [formData, setFormData] = useState<Partial<ReferenceData>>({
    type: ReferenceType.RESEARCH_REPORT,
    authors: '',
    title: '',
    volume: '',
    number: '',
    pages: '',
    year: '',
    publisher: '',
    bookPublisher: '',
    url: '',
    accessDate: new Date().toISOString().split('T')[0]
  });
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleTypeChange = (value: string) => {
    const newType = value as ReferenceType;
    setReferenceType(newType);
    setFormData(prev => ({ ...prev, type: newType }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setFormData(prev => ({
        ...prev,
        accessDate: newDate.toISOString().split('T')[0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as ReferenceData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center text-blue-800">参考文献情報を入力</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">参考文献タイプ</Label>
            <Select
              value={referenceType}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="タイプを選択" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ReferenceType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 共通フィールド */}
          <div className="space-y-2">
            <Label htmlFor="authors">著者（カンマ区切り）</Label>
            <Input
              id="authors"
              name="authors"
              value={formData.authors}
              onChange={handleInputChange}
              placeholder="例：山田太郎,佐藤次郎,鈴木三郎"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="論文・研究報告・書籍のタイトル"
              required
            />
          </div>

          {/* 研究報告と論文誌に共通のフィールド */}
          {(referenceType === ReferenceType.RESEARCH_REPORT || referenceType === ReferenceType.JOURNAL) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="publisher">出版元・掲載誌</Label>
                <Input
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  placeholder={referenceType === ReferenceType.RESEARCH_REPORT 
                    ? "例：情報処理学会研究報告" 
                    : "例：情報処理学会論文誌"}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volume">巻（数字のみ）</Label>
                  <Input
                    id="volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                    placeholder="例：59"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">号（数字のみ）</Label>
                  <Input
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="例：3"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pages">ページ範囲（数字のみ）</Label>
                  <Input
                    id="pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    placeholder="例：992-1004"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">出版年</Label>
                  <Input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="例：2024"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* 書籍固有のフィールド */}
          {referenceType === ReferenceType.BOOK && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bookPublisher">出版社</Label>
                <Input
                  id="bookPublisher"
                  name="bookPublisher"
                  value={formData.bookPublisher}
                  onChange={handleInputChange}
                  placeholder="例：サイエンス社"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">出版年</Label>
                <Input
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="例：2024"
                  required
                />
              </div>
            </>
          )}

          {/* URL固有のフィールド */}
          {referenceType === ReferenceType.URL && (
            <>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="例：https://www.example.com/article"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">参照日</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'yyyy年MM月dd日', { locale: ja }) : 
                      <span>日付を選択</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            参考文献形式に変換
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}