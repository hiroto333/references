"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    ReferenceType,
    Reference,
    ResearchReportReference,
    JournalReference,
    BookReference,
    UrlReference,
} from "@/lib/types";
import { FileText, BookOpen, Globe, Newspaper, Plus } from "lucide-react";

interface ReferenceFormProps {
    onAdd: (reference: Reference) => void;
}

const typeIcons: Record<ReferenceType, React.ReactNode> = {
    research_report: <Newspaper className="h-4 w-4" />,
    journal: <FileText className="h-4 w-4" />,
    book: <BookOpen className="h-4 w-4" />,
    url: <Globe className="h-4 w-4" />,
};

const typeLabels: Record<ReferenceType, string> = {
    research_report: "研究報告",
    journal: "論文誌",
    book: "書籍",
    url: "URL",
};

export function ReferenceForm({ onAdd }: ReferenceFormProps) {
    const [type, setType] = React.useState<ReferenceType>("research_report");

    // 共通フィールド
    const [authors, setAuthors] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [year, setYear] = React.useState("");

    // 研究報告・論文誌用
    const [publisher, setPublisher] = React.useState("");
    const [volume, setVolume] = React.useState("");
    const [number, setNumber] = React.useState("");
    const [pageStart, setPageStart] = React.useState("");
    const [pageEnd, setPageEnd] = React.useState("");

    // URL用
    const [url, setUrl] = React.useState("");
    const [accessDate, setAccessDate] = React.useState("");

    // 書籍用
    const [page, setPage] = React.useState("");

    const resetForm = () => {
        setAuthors("");
        setTitle("");
        setYear("");
        setPublisher("");
        setVolume("");
        setNumber("");
        setPageStart("");
        setPageEnd("");
        setUrl("");
        setAccessDate("");
        setPage("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let reference: Reference;

        switch (type) {
            case "research_report":
                reference = {
                    type: "research_report",
                    authors,
                    title,
                    year,
                    publisher,
                    volume,
                    number,
                    pageStart,
                    pageEnd,
                } as ResearchReportReference;
                break;
            case "journal":
                reference = {
                    type: "journal",
                    authors,
                    title,
                    year,
                    journal: publisher,
                    volume,
                    number,
                    pageStart,
                    pageEnd,
                } as JournalReference;
                break;
            case "book":
                reference = {
                    type: "book",
                    authors,
                    title,
                    year,
                    publisher,
                    page: page || undefined,
                } as BookReference;
                break;
            case "url":
                reference = {
                    type: "url",
                    authors,
                    title,
                    year,
                    url,
                    accessDate,
                } as UrlReference;
                break;
        }

        onAdd(reference);
        resetForm();
    };

    return (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    参考文献を追加
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* タイプ選択 */}
                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium">
                            参考文献のタイプ
                        </Label>
                        <Select
                            value={type}
                            onValueChange={(value) => setType(value as ReferenceType)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {(Object.keys(typeLabels) as ReferenceType[]).map((t) => (
                                    <SelectItem key={t} value={t}>
                                        <span className="flex items-center gap-2">
                                            {typeIcons[t]}
                                            {typeLabels[t]}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 共通フィールド */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="authors" className="text-sm font-medium">
                                著者 <span className="text-muted-foreground text-xs">（カンマ区切り）</span>
                            </Label>
                            <Input
                                id="authors"
                                value={authors}
                                onChange={(e) => setAuthors(e.target.value)}
                                placeholder="例: 山田太郎，佐藤花子，鈴木一郎"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">
                                タイトル
                            </Label>
                            <Textarea
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="論文・書籍のタイトルを入力"
                                required
                                className="min-h-[80px] resize-none"
                            />
                        </div>
                    </div>

                    {/* 研究報告・論文誌用フィールド */}
                    {(type === "research_report" || type === "journal") && (
                        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div className="space-y-2">
                                <Label htmlFor="publisher" className="text-sm font-medium">
                                    {type === "research_report" ? "出版元・掲載誌" : "論文誌名"}
                                </Label>
                                <Input
                                    id="publisher"
                                    value={publisher}
                                    onChange={(e) => setPublisher(e.target.value)}
                                    placeholder={
                                        type === "research_report"
                                            ? "例: 情報処理学会研究報告"
                                            : "例: 情報処理学会論文誌"
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="volume" className="text-sm font-medium">
                                        巻 (Volume)
                                    </Label>
                                    <Input
                                        id="volume"
                                        value={volume}
                                        onChange={(e) => setVolume(e.target.value)}
                                        placeholder="例: Vol.2020-GN-109"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="number" className="text-sm font-medium">
                                        号 (Number)
                                    </Label>
                                    <Input
                                        id="number"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        placeholder="例: No.13"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pageStart" className="text-sm font-medium">
                                        開始ページ
                                    </Label>
                                    <Input
                                        id="pageStart"
                                        value={pageStart}
                                        onChange={(e) => setPageStart(e.target.value)}
                                        placeholder="例: 1"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pageEnd" className="text-sm font-medium">
                                        終了ページ
                                    </Label>
                                    <Input
                                        id="pageEnd"
                                        value={pageEnd}
                                        onChange={(e) => setPageEnd(e.target.value)}
                                        placeholder="例: 8"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 書籍用フィールド */}
                    {type === "book" && (
                        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div className="space-y-2">
                                <Label htmlFor="publisher" className="text-sm font-medium">
                                    出版社
                                </Label>
                                <Input
                                    id="publisher"
                                    value={publisher}
                                    onChange={(e) => setPublisher(e.target.value)}
                                    placeholder="例: サイエンス社"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="page" className="text-sm font-medium">
                                    参照ページ <span className="text-muted-foreground text-xs">（任意）</span>
                                </Label>
                                <Input
                                    id="page"
                                    value={page}
                                    onChange={(e) => setPage(e.target.value)}
                                    placeholder="例: 42"
                                />
                            </div>
                        </div>
                    )}

                    {/* URL用フィールド */}
                    {type === "url" && (
                        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                            <div className="space-y-2">
                                <Label htmlFor="url" className="text-sm font-medium">
                                    URL
                                </Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com/article"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accessDate" className="text-sm font-medium">
                                    参照日
                                </Label>
                                <Input
                                    id="accessDate"
                                    value={accessDate}
                                    onChange={(e) => setAccessDate(e.target.value)}
                                    placeholder="例: 2024.01.15"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* 出版年（共通） */}
                    <div className="space-y-2">
                        <Label htmlFor="year" className="text-sm font-medium">
                            出版年
                        </Label>
                        <Input
                            id="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="例: 2024"
                            required
                            className="w-32"
                        />
                    </div>

                    {/* 送信ボタン */}
                    <Button
                        type="submit"
                        className="w-full h-11 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        参考文献を追加
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
