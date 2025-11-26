#!/bin/bash

# Learn2Drive Deployment Script for Fly.io

set -e

# Setup Fly CLI path
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

echo "🚗 Learn2Drive Deployment Script"
echo "================================="

# Check if logged in
if ! flyctl auth whoami &>/dev/null; then
    echo ""
    echo "📝 You need to login to Fly.io first"
    echo "   Running: flyctl auth login"
    echo ""
    flyctl auth login
fi

echo ""
echo "✓ Logged in as: $(flyctl auth whoami)"
echo ""

# Check if app exists
APP_NAME="learn2drive"

if ! flyctl apps list | grep -q "$APP_NAME"; then
    echo "📦 Creating new Fly.io app: $APP_NAME"
    flyctl launch --name $APP_NAME --region ord --no-deploy --yes
    
    echo ""
    echo "🗄️  Creating PostgreSQL database..."
    flyctl postgres create --name ${APP_NAME}-db --region ord --vm-size shared-cpu-1x --volume-size 1 --initial-cluster-size 1 --yes
    
    echo ""
    echo "🔗 Attaching database to app..."
    flyctl postgres attach ${APP_NAME}-db --app $APP_NAME --yes
fi

echo ""
echo "🚀 Deploying application..."
flyctl deploy

echo ""
echo "🔄 Running database migrations..."
flyctl ssh console -C "npx prisma migrate deploy" --app $APP_NAME

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is live at: https://$APP_NAME.fly.dev"
echo ""
echo "📊 View logs: flyctl logs -a $APP_NAME"
echo "📡 Open app:  flyctl open -a $APP_NAME"

