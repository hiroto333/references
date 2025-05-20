import { ReferenceData } from "../types/reference";

/**
 * 将来的にバックエンドAPIを統合するためのサービスクラス
 * 現在はフロントエンドのみで完結
 */
export class ReferenceService {
  /**
   * URLから参考文献データを取得する（将来的な実装用）
   * @param url 取得したいコンテンツのURL
   */
  static async extractFromUrl(url: string): Promise<Partial<ReferenceData>> {
    // TODO: 実際のバックエンドAPIが実装されたら、ここでAPIを呼び出す
    // 現在はモックデータを返す
    return {
      authors: 'URLから抽出された著者',
      title: 'URLから抽出されたタイトル',
      url: url,
      accessDate: new Date().toISOString().split('T')[0]
    };
  }

  /**
   * PDFから参考文献データを抽出する（将来的な実装用）
   * @param _file PDFファイル
   */
  static async extractFromPdf(_file: File): Promise<Partial<ReferenceData>> {
    // TODO: 実際のバックエンドAPIが実装されたら、ここでAPIを呼び出す
    return {
      authors: 'PDFから抽出された著者',
      title: 'PDFから抽出されたタイトル',
      publisher: 'PDFから抽出された出版元',
      year: new Date().getFullYear().toString()
    };
  }
}