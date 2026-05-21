# 2026 FIFA World Cup manager

## Shared data

Shared cross-device state is stored in a GitHub Gist file named `worldcup_state.json`.
The app does not use Supabase. `localStorage` is only a per-device cache or draft store.

このディレクトリは、2026年FIFAワールドカップ本大会のみを管理します。

大陸予選は対象外です。対象範囲は本大会のグループステージから決勝までです。

## サイトが読み込むJSON

本大会管理タブは `data/worldcup2026_matches.json` を読み込みます。

Markdownは閲覧・共有用の生成物であり、サイトのデータ本体ではありません。

## 編集する元データ

- `data/worldcup2026_matches.json`: 本大会管理タブが読み込む試合JSON
- `data/manual/teams.csv`: JSON生成用のチーム一覧
- `data/manual/matches.csv`: JSON生成用の試合一覧

スコア、延長戦結果、PK戦結果は外部サイトから自動取得しません。ネタバレ防止のため、必ず手入力します。

サイト上で入力したスコアはブラウザの `localStorage` に保存されます。

## 自動生成ファイル

`generated/` 配下は直接編集しません。

```powershell
python .\worldcup_betting\scripts\generate_worldcup_outputs.py
```

生成されるファイル:

- `generated/matches.md`
- `generated/standings.md`
- `generated/knockout.md`
- `generated/worldcup_state.json`
- `data/worldcup2026_matches.json`

## 日時の扱い

全試合の基準日時は `kickoff_jst` に日本時間JSTで入力します。

必要に応じて `kickoff_local` と `local_timezone` も入力し、JST変換の検算に使います。

## スコア入力ルール

- `score_home`: ホーム側の最終スコア
- `score_away`: アウェイ側の最終スコア
- `penalty_home`: PK戦のホーム側スコア
- `penalty_away`: PK戦のアウェイ側スコア

順位表、3位上位ランキング、決勝トーナメントの勝ち上がり、Mermaid形式の図は、手入力スコアから生成します。
