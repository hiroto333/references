'use client';

import { useState } from 'react';
import ReferenceForm from '../components/ReferenceForm';
import ReferenceResult from '../components/ReferenceResult';
import { ReferenceData } from '../types/reference';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BookIcon, FileTextIcon, LinkIcon, NewspaperIcon } from "lucide-react";
import { Toaster } from "../components/ui/sonner";

export default function Home() {
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);

  const handleFormSubmit = (data: ReferenceData) => {
    setReferenceData(data);
  };

  return (
    <>
      <Toaster />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-blue-800">参考文献フォーマッター</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              研究報告、論文誌、書籍、URLを簡単に引用形式に変換。伊藤研指定の参考文献形式に対応。
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <Tabs defaultValue="form" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="form" className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">フォームで入力</span>
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2" disabled>
                    <LinkIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">URLから取得</span>
                  </TabsTrigger>
                  <TabsTrigger value="pdf" className="flex items-center gap-2" disabled>
                    <NewspaperIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">PDFから取得</span>
                  </TabsTrigger>
                  <TabsTrigger value="bibtex" className="flex items-center gap-2" disabled>
                    <BookIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">BibTeXから変換</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="form">
                  <ReferenceForm onSubmit={handleFormSubmit} />
                </TabsContent>
                
                <TabsContent value="url">
                  <div className="p-12 text-center text-gray-500">
                    <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">URLから自動取得</h3>
                    <p>この機能は近日公開予定です。</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="pdf">
                  <div className="p-12 text-center text-gray-500">
                    <NewspaperIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">PDFから自動取得</h3>
                    <p>この機能は近日公開予定です。</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="bibtex">
                  <div className="p-12 text-center text-gray-500">
                    <BookIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">BibTeXから変換</h3>
                    <p>この機能は近日公開予定です。</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              {referenceData && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <ReferenceResult data={referenceData} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}