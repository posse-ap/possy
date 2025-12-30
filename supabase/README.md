# Supabase Local Development Setup

This directory contains the Supabase configuration for local development.

## Quick Start

When you open this project in GitHub Codespaces, Supabase will automatically start via the `.devcontainer/post-create.sh` script.

## Manual Commands

### Start Supabase
```bash
npm run supabase:start
```

### Stop Supabase
```bash
npm run supabase:stop
```

### Restart Supabase
```bash
npm run supabase:restart
```

### Reset Database (with seed data)
```bash
npm run supabase:reset
```

### Check Supabase Status
```bash
npm run supabase:status
```

## Access Points

After starting Supabase, you can access:

- **Supabase Studio**: http://127.0.0.1:54323
- **API URL**: http://127.0.0.1:54321
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Inbucket (Email Testing)**: http://127.0.0.1:54324

## Database Migrations

Create a new migration:
```bash
supabase migration new <migration_name>
```

This will create a new SQL file in `supabase/migrations/` directory.

## Seed Data

Edit `supabase/seed.sql` to add seed data for local development. This file runs automatically when you reset your database.

## Environment Variables

The project uses these environment variables (defined in `.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase API URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

For local development, these are automatically configured to use the local Supabase instance.

## Using Supabase in Your Code

Import the Supabase client:

```typescript
import { supabase } from "@/libs/supabaseClient";

// Example: Fetch data
const { data, error } = await supabase
  .from("your_table")
  .select("*");
```

## Configuration

The `config.toml` file contains all Supabase service configurations including:

- API settings
- Database settings
- Authentication settings
- Storage settings
- Realtime settings
- Edge Functions settings

Modify `config.toml` as needed for your project.
