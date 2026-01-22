import {
    Reference,
    ResearchReportReference,
    JournalReference,
    BookReference,
    UrlReference,
} from "./types";

/**
 * 研究報告のフォーマット
 * 例: [1] 紀本雅大，伊藤淳子，宗森純：評価表現に着目した映画レビュー閲覧を支援するシステムの提案，情報処理学会研究報告，Vol.2020-GN-109, No.13, pp.1–8 (2020)．
 */
function formatResearchReport(ref: ResearchReportReference, num: number): string {
    const parts = [
        `[${num}]`,
        `${ref.authors}：${ref.title}，`,
        `${ref.publisher}，`,
        `${ref.volume}, ${ref.number}, `,
        `pp.${ref.pageStart}–${ref.pageEnd}`,
        ` (${ref.year})．`,
    ];
    return parts.join("");
}

/**
 * 論文誌のフォーマット
 * 例: [4] 榎田宗丈，福島拓，吉野孝，杉本賢二，江種伸之：まち歩き型の情報収集に対応した防災マップづくり一貫支援システムの提案，情報処理学会論文誌，Vol.59, No.3, pp.992–1004 (2018)．
 */
function formatJournal(ref: JournalReference, num: number): string {
    const parts = [
        `[${num}]`,
        `${ref.authors}：${ref.title}，`,
        `${ref.journal}，`,
        `${ref.volume}, ${ref.number}, `,
        `pp.${ref.pageStart}–${ref.pageEnd}`,
        ` (${ref.year})．`,
    ];
    return parts.join("");
}

/**
 * 書籍のフォーマット
 * 例: [7] 大坊郁夫：しぐさのコミュニケーション―人は親しみをどう伝えあうか，サイエンス社(1998)．
 */
function formatBook(ref: BookReference, num: number): string {
    let text = `[${num}] ${ref.authors}：${ref.title}，${ref.publisher}(${ref.year})`;
    if (ref.page) {
        text += `，p.${ref.page}`;
    }
    text += "．";
    return text;
}

/**
 * URLのフォーマット
 * 例: [9] 一般社団法人日本経済団体連合会：2016年度 新卒採用に関するアンケート調査結果，入手先"http://..." (2016.11.15 確認)．
 */
function formatUrl(ref: UrlReference, num: number): string {
    return `[${num}] ${ref.authors}：${ref.title}，入手先"${ref.url}" (${ref.accessDate} 確認)．`;
}

/**
 * 参考文献をフォーマットする
 */
export function formatReference(reference: Reference, number: number): string {
    switch (reference.type) {
        case "research_report":
            return formatResearchReport(reference, number);
        case "journal":
            return formatJournal(reference, number);
        case "book":
            return formatBook(reference, number);
        case "url":
            return formatUrl(reference, number);
        default:
            return "";
    }
}

/**
 * 参考文献タイプの表示名を取得
 */
export function getReferenceTypeName(type: Reference["type"]): string {
    const names: Record<Reference["type"], string> = {
        research_report: "研究報告",
        journal: "論文誌",
        book: "書籍",
        url: "URL",
    };
    return names[type];
}
