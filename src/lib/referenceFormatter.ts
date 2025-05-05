import { ReferenceData, ReferenceType } from '@/types/reference';

/**
 * 参考文献データを指定された形式に変換する
 */
export function formatReference(data: ReferenceData): string {
  // 著者リストをフォーマット（カンマ区切りから全角カンマ区切りに）
  const authorList = data.authors.split(',').map(author => author.trim()).join('，');
  
  switch (data.type) {
    case ReferenceType.RESEARCH_REPORT:
      return `${authorList}：${data.title}，${data.publisher}，${data.volume}, ${data.number}, ${data.pages} (${data.year})．`;
    
    case ReferenceType.JOURNAL:
      return `${authorList}：${data.title}，${data.publisher}，${data.volume}, ${data.number}, ${data.pages}(${data.year})．`;
    
    case ReferenceType.BOOK:
      return `${authorList}：${data.title}，${data.bookPublisher} (${data.year})．`;
    
    case ReferenceType.URL:
      // 日付をフォーマット (YYYY.MM.DD)
      const formattedDate = data.accessDate ? formatDate(data.accessDate) : '';
      return `${authorList}：${data.title}，入手先 "${data.url}" (${formattedDate} 確認)．`;
    
    default:
      return '参考文献形式の変換に失敗しました。';
  }
}

/**
 * 日付を YYYY.MM.DD 形式にフォーマット
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}