'use client';

import { useState } from 'react';
import { ReferenceData, ReferenceType } from '@/types/reference';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { formatReference } from '@/lib/referenceFormatter';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface ReferenceResultProps {
  data: ReferenceData;
}

export default function ReferenceResult({ data }: ReferenceResultProps) {
  const [copied, setCopied] = useState(false);
  
  const formatReference = (data: ReferenceData): string => {
    const authorList = data.authors.split(',').map(author => author.trim()).join('，');
    
    switch (data.type) {
      case ReferenceType.RESEARCH_REPORT:
        return `${authorList}：${data.title}，${data.publisher}，Vol.${data.volume}, No.${data.number}, pp.${data.pages} (${data.year})．`;
      
      case ReferenceType.JOURNAL:
        return `${authorList}：${data.title}，${data.publisher}，Vol.${data.volume}, No.${data.number}, pp.${data.pages}(${data.year})．`;
      
      case ReferenceType.BOOK:
        return `${authorList}：${data.title}，${data.bookPublisher} (${data.year})．`;
      
      case ReferenceType.URL:
        const formattedDate = data.accessDate ? formatDate(data.accessDate) : '';
        return `${authorList}：${data.title}，入手先 "${data.url}" (${formattedDate} 確認)．`;
      
      default:
        return '参考文献形式の変換に失敗しました。';
    }
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };
  
  const formattedText = formatReference(data);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedText).then(() => {
      setCopied(true);
      toast("コピー完了", {
        description: "クリップボードにコピーしました",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-800">変換結果</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <AlertDescription className="font-mono text-lg break-words">
            {formattedText}
          </AlertDescription>
        </Alert>
        
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="w-full"
        >
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
      </CardContent>
    </Card>
  );
}