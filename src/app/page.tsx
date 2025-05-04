'use client';

import { useState } from 'react';
import ReferenceForm from '@/components/ReferenceForm';
import ReferenceResult from '@/components/ReferenceResult';
import { ReferenceData, ReferenceType } from '@/types/reference';

export default function Home() {
  const [referenceData, setReferenceData] = useState<ReferenceData | null>(null);

  const handleFormSubmit = (data: ReferenceData) => {
    setReferenceData(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-800">参考文献フォーマッター</h1>
        <p className="text-center text-gray-600 mb-8">研究報告、論文誌、書籍、URLを簡単に引用形式に変換</p>
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <ReferenceForm onSubmit={handleFormSubmit} />
          
          {referenceData && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">変換結果</h2>
              <ReferenceResult data={referenceData} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}