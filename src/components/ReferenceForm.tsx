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

  // 入力フォームのラベルとインプットのスタイル共通化
  const inputGroupClass = "mb-5";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";
  const selectClass = "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={inputGroupClass}>
        <label className={labelClass}>
          参考文献タイプ
        </label>
        <select
          className={selectClass}
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
      <div className={inputGroupClass}>
        <label className={labelClass}>
          著者（カンマ区切り）
        </label>
        <input
          type="text"
          name="authors"
          value={formData.authors}
          onChange={handleInputChange}
          placeholder="例: 山田太郎,佐藤次郎,鈴木三郎"
          className={inputClass}
          required
        />
      </div>

      <div className={inputGroupClass}>
        <label className={labelClass}>
          タイトル
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="論文・研究報告・書籍のタイトル"
          className={inputClass}
          required
        />
      </div>

      {/* 研究報告と論文誌に共通のフィールド */}
      {(referenceType === ReferenceType.RESEARCH_REPORT || referenceType === ReferenceType.JOURNAL) && (
        <>
          <div className={inputGroupClass}>
            <label className={labelClass}>
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
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={inputGroupClass}>
              <label className={labelClass}>
                巻（数字のみ）
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500">Vol.</span>
                <input
                  type="text"
                  name="volume"
                  value={formData.volume}
                  onChange={handleInputChange}
                  placeholder="59"
                  className={`${inputClass} pl-12`}
                  required
                />
              </div>
            </div>
            <div className={inputGroupClass}>
              <label className={labelClass}>
                号（数字のみ）
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500">No.</span>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="3"
                  className={`${inputClass} pl-12`}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={inputGroupClass}>
              <label className={labelClass}>
                ページ範囲（数字のみ）
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500">pp.</span>
                <input
                  type="text"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                  placeholder="992-1004"
                  className={`${inputClass} pl-12`}
                  required
                />
              </div>
            </div>
            <div className={inputGroupClass}>
              <label className={labelClass}>
                出版年
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="2024"
                className={inputClass}
                required
              />
            </div>
          </div>
        </>
      )}

      {/* 書籍固有のフィールド */}
      {referenceType === ReferenceType.BOOK && (
        <>
          <div className={inputGroupClass}>
            <label className={labelClass}>
              出版社
            </label>
            <input
              type="text"
              name="bookPublisher"
              value={formData.bookPublisher}
              onChange={handleInputChange}
              placeholder="例: サイエンス社"
              className={inputClass}
              required
            />
          </div>
          <div className={inputGroupClass}>
            <label className={labelClass}>
              出版年
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="2024"
              className={inputClass}
              required
            />
          </div>
        </>
      )}

      {/* URL固有のフィールド */}
      {referenceType === ReferenceType.URL && (
        <>
          <div className={inputGroupClass}>
            <label className={labelClass}>
              URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://www.example.com/article"
              className={inputClass}
              required
            />
          </div>
          <div className={inputGroupClass}>
            <label className={labelClass}>
              参照日
            </label>
            <input
              type="date"
              name="accessDate"
              value={formData.accessDate}
              onChange={handleInputChange}
              className={inputClass}
              required
            />
          </div>
        </>
      )}

      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md font-medium text-lg"
        >
          参考文献形式に変換
        </button>
      </div>
    </form>
  );
}