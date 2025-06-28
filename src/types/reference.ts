export type ReferenceData = {
  type: string
  authors: string
  title: string
  publisher?: string | null
  volume?: string | null
  number?: string | null
  pages?: string | null
  year?: string | null
  bookPublisher?: string | null
  url?: string | null
  accessDate?: string | null
}

export enum ReferenceType {
  RESEARCH_REPORT = "RESEARCH_REPORT",
  JOURNAL = "JOURNAL",
  BOOK = "BOOK",
  URL = "URL",
}
