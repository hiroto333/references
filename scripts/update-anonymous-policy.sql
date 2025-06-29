-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can only access their own references" ON user_references;

-- 匿名ユーザーも含めて、ユーザーは自分のデータのみアクセス可能
CREATE POLICY "Users can access their own references including anonymous" ON user_references
FOR ALL USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

-- 匿名認証を有効にするための設定確認用クエリ
-- （実際の設定はSupabase Dashboardで行います）
SELECT 'Anonymous authentication should be enabled in Supabase Dashboard > Authentication > Settings' as note;
