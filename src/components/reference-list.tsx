"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavedReference } from "@/lib/types";
import { getReferenceTypeName } from "@/lib/format-reference";
import {
    Copy,
    Check,
    Trash2,
    GripVertical,
    ClipboardList,
    Download,
} from "lucide-react";
import { toast } from "sonner";

interface ReferenceListProps {
    references: SavedReference[];
    onDelete: (id: string) => void;
    onReorder: (references: SavedReference[]) => void;
}

export function ReferenceList({
    references,
    onDelete,
    onReorder,
}: ReferenceListProps) {
    const [copiedId, setCopiedId] = React.useState<string | null>(null);
    const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

    const handleCopy = async (ref: SavedReference) => {
        try {
            await navigator.clipboard.writeText(ref.formattedText);
            setCopiedId(ref.id);
            toast.success("クリップボードにコピーしました");
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            toast.error("コピーに失敗しました");
        }
    };

    const handleCopyAll = async () => {
        try {
            const allText = references.map((r) => r.formattedText).join("\n");
            await navigator.clipboard.writeText(allText);
            toast.success("すべての参考文献をコピーしました");
        } catch {
            toast.error("コピーに失敗しました");
        }
    };

    const handleExport = () => {
        const allText = references.map((r) => r.formattedText).join("\n");
        const blob = new Blob([allText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "references.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("参考文献をエクスポートしました");
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newRefs = [...references];
        const [draggedItem] = newRefs.splice(draggedIndex, 1);
        newRefs.splice(index, 0, draggedItem);

        // 番号を振り直す
        const renumbered = newRefs.map((ref, i) => ({
            ...ref,
            number: i + 1,
            formattedText: ref.formattedText.replace(/^\[\d+\]/, `[${i + 1}]`),
        }));

        onReorder(renumbered);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    if (references.length === 0) {
        return (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                        <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">参考文献がありません</p>
                        <p className="text-sm mt-1">
                            左側のフォームから参考文献を追加してください
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        参考文献リスト
                        <span className="text-sm font-normal text-muted-foreground">
                            ({references.length}件)
                        </span>
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyAll}
                            className="h-8"
                        >
                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                            すべてコピー
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            className="h-8"
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            エクスポート
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {references.map((ref, index) => (
                    <div
                        key={ref.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`group relative p-4 rounded-lg border bg-card transition-all duration-200 hover:shadow-md ${draggedIndex === index
                            ? "opacity-50 scale-[0.98]"
                            : "hover:border-primary/30"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            {/* ドラッグハンドル */}
                            <div className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors pt-0.5">
                                <GripVertical className="h-5 w-5" />
                            </div>

                            {/* 参考文献内容 */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {getReferenceTypeName(ref.reference.type)}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed break-all">
                                    {ref.formattedText}
                                </p>
                            </div>

                            {/* アクションボタン */}
                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleCopy(ref)}
                                >
                                    {copiedId === ref.id ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => onDelete(ref.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
