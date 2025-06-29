-- user_id カラムを追加
ALTER TABLE user_references ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Enable all operations for all users" ON user_references;

-- 新しいRLSポリシーを作成（ユーザーは自分のデータのみアクセス可能）
CREATE POLICY "Users can only access their own references" ON user_references
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- インデックスを追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_user_references_user_id ON user_references(user_id);
