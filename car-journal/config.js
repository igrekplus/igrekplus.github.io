// 公開可能な設定のみ。service_role/secretキーはここに置かない。
// 未設定（空文字のまま）の場合、サイトは端末内保存モードで正常に動作する。
window.CAR_JOURNAL_CONFIG = Object.freeze({
  supabaseUrl: '',
  supabasePublishableKey: ''
});
