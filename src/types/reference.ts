export enum ReferenceType {
    RESEARCH_REPORT = '研究報告',
    JOURNAL = '論文誌',
    BOOK = '書籍',
    URL = 'URL'
  }
  
  export interface ReferenceData {
    type: ReferenceType;
    // 共通フィールド
    authors: string; // カンマ区切りの著者リスト
    title: string;
    
    // 研究報告と論文誌に必要
    publisher?: string; // 出版元・掲載誌
    volume?: string;    // 巻
    number?: string;    // 号
    pages?: string;     // ページ数範囲
    year?: string;      // 出版年
    
    // 書籍固有
    bookPublisher?: string; // 出版社
    
    // URL固有
    url?: string;         // URL
    accessDate?: string;  // 参照日
  }