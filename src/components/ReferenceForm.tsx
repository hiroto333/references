'use client';

import { useState } from 'react';
import { ReferenceData, ReferenceType } from '@/types/reference';

interface ReferenceFormProps {
  onSubmit: (data: ReferenceData) => void;
}

export default function ReferenceForm({ onSubmit }: ReferenceFormProps) {
  const [referenceType, setReferenceType] = useState<ReferenceType>(ReferenceType.RESEARCH_REPORT);
  const [formData, setFormData] = useState<Partial<ReferenceData>>({
    type: ReferenceType.RESEARCH_REPORT,
    authors: '',
    title: '',
    publisher: '',
    volume: '',
    number: '',
    pages: '',
    year: '',
    bookPublisher: '',
    url: '',
    accessDate: new Date().toISOString().split('T')[0]
  });

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ReferenceType;
    setReferenceType(newType);
    setFormData(prev => ({ ...prev, type: newType }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as ReferenceData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          参考文献タイプ
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={referenceType}
          onChange={handleTypeChange}
        >
          {Object.values(ReferenceType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* 共通フィールド */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          著者（カンマ区切り）
        </label>
        <input
          type="text"
          name="authors"
          value={formData.authors}
          onChange={handleInputChange}
          placeholder="例: 山田太郎,佐藤次郎,鈴木三郎"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="論文・研究報告・書籍のタイトル"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {/* 研究報告と論文誌に共通のフィールド */}
      {(referenceType === ReferenceType.RESEARCH_REPORT || referenceType === ReferenceType.JOURNAL) && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出版元・掲載誌
            </label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleInputChange}
              placeholder={referenceType === ReferenceType.RESEARCH_REPORT 
                ? "例: 情報処理学会研究報告" 
                : "例: 情報処理学会論文誌"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                巻（Volume）
              </label>
              <input
                type="text"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                placeholder="例: Vol.59"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                号（Number）
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="例: No.3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ページ範囲
              </label>
              <input
                type="text"
                name="pages"
                value={formData.pages}
                onChange={handleInputChange}
                placeholder="例: pp.992-1004"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出版年
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="例: 2020"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </>
      )}

      {/* 書籍固有のフィールド */}
      {referenceType === ReferenceType.BOOK && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出版社
            </label>
            <input
              type="text"
              name="bookPublisher"
              value={formData.bookPublisher}
              onChange={handleInputChange}
              placeholder="例: サイエンス社"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出版年
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="例: 2020"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </>
      )}

      {/* URL固有のフィールド */}
      {referenceType === ReferenceType.URL && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="例: https://www.example.com/article"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              参照日
            </label>
            <input
              type="date"
              name="accessDate"
              value={formData.accessDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </>
      )}

      <div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          参考文献形式に変換
        </button>
      </div>
    </form>
  );
}