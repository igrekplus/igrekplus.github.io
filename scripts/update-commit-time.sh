#!/bin/bash
# update-commit-time.sh
# コミット前にindex.htmlのcommitTimeタイムスタンプを現在時刻で更新するスクリプト
# 使い方: ./scripts/update-commit-time.sh && git add ... && git commit ...

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HTML="$SCRIPT_DIR/../worldcup_betting/index.html"

# JST (UTC+9) でフォーマット
NOW=$(TZ=Asia/Tokyo date "+%Y-%m-%d %H:%M:%S +0900")

# <time class="site-footer-time" id="commitTime">...</time> の中身を置換
sed -i '' "s|<time class=\"site-footer-time\" id=\"commitTime\">[^<]*</time>|<time class=\"site-footer-time\" id=\"commitTime\">${NOW}</time>|" "$HTML"

echo "✅ commitTime updated to: $NOW"
