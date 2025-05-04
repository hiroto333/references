'use client';

import { useState } from 'react';
import { ReferenceData, ReferenceType } from '@/types/reference';

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
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <p className="font-mono text-lg break-words">{formattedText}</p>
      </div>
      
      <button
        onClick={copyToClipboard}
        className="flex items-center justify-center gap-2 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors shadow-sm font-medium"
      >
        {copied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            コピーしました
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            クリップボードにコピー
          </>
        )}
      </button>
    </div>
  );
}