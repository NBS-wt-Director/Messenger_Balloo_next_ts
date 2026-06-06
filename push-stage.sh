
#!/bin/bash
# App Balloo - Push Stage to GitHub

STAGE=$1
MESSAGE=$2

if [ -z "$STAGE" ]; then
  echo "Usage: ./push-stage.sh <stage_number> <message>"
  echo "Example: ./push-stage.sh 5 'Frontend Web completion'"
  exit 1
fi

if [ -z "$MESSAGE" ]; then
  MESSAGE="Stage $STAGE update"
fi

echo "🚀 Pushing Stage $STAGE to GitHub..."
echo "📝 Message: $MESSAGE"

git add .
git commit -m "Stage $STAGE: $MESSAGE"
git push origin main

if [ $? -eq 0 ]; then
  echo "✅ Stage $STAGE pushed successfully!"
else
  echo "❌ Push failed. Check git status."
  exit 1
fi
