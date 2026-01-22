// 参考文献のタイプ定義
export type ReferenceType = "research_report" | "journal" | "book" | "url";

// 共通の参考文献フィールド
export interface BaseReference {
    type: ReferenceType;
    authors: string; // カンマ区切りの著者名
    title: string;
    year: string;
}

// 研究報告
export interface ResearchReportReference extends BaseReference {
    type: "research_report";
    publisher: string; // 出版元（例: 情報処理学会研究報告）
    volume: string; // 巻（例: Vol.2020-GN-109）
    number: string; // 号（例: No.13）
    pageStart: string;
    pageEnd: string;
}

// 論文誌
export interface JournalReference extends BaseReference {
    type: "journal";
    journal: string; // 掲載誌（例: 情報処理学会論文誌）
    volume: string; // 巻（例: Vol.59）
    number: string; // 号（例: No.3）
    pageStart: string;
    pageEnd: string;
}

// 書籍
export interface BookReference extends BaseReference {
    type: "book";
    publisher: string; // 出版社（例: サイエンス社）
    page?: string; // 特定ページ（オプション）
}

// URL
export interface UrlReference extends BaseReference {
    type: "url";
    url: string;
    accessDate: string; // 参照日（例: 2016.11.15）
}

export type Reference =
    | ResearchReportReference
    | JournalReference
    | BookReference
    | UrlReference;

// 保存される参考文献（番号付き）
export interface SavedReference {
    id: string;
    number: number;
    reference: Reference;
    formattedText: string;
}
