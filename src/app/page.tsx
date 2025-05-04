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
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">参考文献フォーマッター</h1>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <ReferenceForm onSubmit={handleFormSubmit} />
          
          {referenceData && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">変換結果</h2>
              <ReferenceResult data={referenceData} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}