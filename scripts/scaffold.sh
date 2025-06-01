#!/bin/bash

# Usage: ./scripts/scaffold.sh [모듈명] 예: item/source
# Example: ./scripts/scaffold.sh app/item/source

NAME=$1

if [ -z "$NAME" ]; then
  echo "❌ 모듈명을 입력하세요. 예: app/item/source"
  exit 1
fi

APP_DIR="src/app/$NAME"

# 하위 폴더 생성
mkdir -p "$APP_DIR/base"
mkdir -p "$APP_DIR/source"
mkdir -p "$APP_DIR/sync"

nest g module "app/$NAME"
nest g controller "app/$NAME" --no-spec
nest g service "app/$NAME" --no-spec

echo "✅ '$NAME' 모듈/컨트롤러/서비스 생성 완료"