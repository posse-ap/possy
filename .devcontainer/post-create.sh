#!/bin/bash
set -e

echo "Installing vim..."
sudo apt-get update && sudo apt-get install -y vim

echo "Installing npm dependencies..."
npm install

echo "Installing GitHub Copilot CLI..."
gh extension install github/gh-copilot

echo "Installing Supabase CLI..."
brew install supabase/tap/supabase

echo "Starting Supabase..."
supabase start

echo "Supabase is running!"
echo "  - Studio: http://127.0.0.1:54323"
echo "  - API URL: http://127.0.0.1:54321"
echo "  - DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
echo "  - Inbucket (Email Testing): http://127.0.0.1:54324"

echo "Setup complete!"
