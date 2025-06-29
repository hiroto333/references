-- 参考文献テーブルを作成
CREATE TABLE IF NOT EXISTS references (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  authors TEXT NOT NULL,
  title TEXT NOT NULL,
  publisher TEXT,
  volume VARCHAR(20),
  number VARCHAR(20),
  pages VARCHAR(50),
  year VARCHAR(10),
  book_publisher TEXT,
  url TEXT,
  access_date DATE,
  formatted_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを作成（検索性能向上のため）
CREATE INDEX IF NOT EXISTS idx_references_type ON references(type);
CREATE INDEX IF NOT EXISTS idx_references_created_at ON references(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_references_authors ON references USING gin(to_tsvector('japanese', authors));
CREATE INDEX IF NOT EXISTS idx_references_title ON references USING gin(to_tsvector('japanese', title));
