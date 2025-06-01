#!/bin/bash

# 사용법: ./rename-module.sh oldName newName
# 예: ./rename-module.sh item contents

OLD=$1
NEW=$2

# 1. 디렉토리명 변경
mv src/app/$OLD src/app/$NEW

# 2. 파일명 변경
for FILE in src/app/$NEW/*$OLD*.ts; do
  NEWFILE=$(echo $FILE | sed "s/$OLD/$NEW/g")
  mv "$FILE" "$NEWFILE"
done

# 3. 파일 내 클래스명 및 import 경로 치환
grep -rl "$OLD" src/app/$NEW | xargs sed -i "" "s/\b$OLD\b/$NEW/g"
grep -rl "$(tr '[:lower:]' '[:upper:]' <<< ${OLD:0:1})${OLD:1}" src/app/$NEW | xargs sed -i "" "s/\b$(tr '[:lower:]' '[:upper:]' <<< ${OLD:0:1})${OLD:1}\b/$(tr '[:lower:]' '[:upper:]' <<< ${NEW:0:1})${NEW:1}/g"