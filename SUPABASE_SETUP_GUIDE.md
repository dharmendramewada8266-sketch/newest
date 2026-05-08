# Supabase Setup Guide - Step by Step

## Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project" or "Sign Up"
3. Sign in with GitHub, Google, or email
4. Click "New Project"
5. Select your organization (or create one)
6. Enter project details:
   - **Project Name**: `workmandi` (or your preferred name)
   - **Database Password**: Create a strong password (save it somewhere safe)
   - **Region**: Choose the region closest to your users
7. Click "Create new project"
8. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Project Credentials
1. After project creation, go to **Project Settings** (gear icon in left sidebar)
2. Click on **API** in the sidebar
3. You will see two important values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Update Configuration File
1. Open `supabase-config.js` in your project
2. Replace these lines:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. With your actual credentials:
   ```javascript
   const SUPABASE_URL = 'https://your-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key...';
   ```

## Step 4: Create Database Tables
1. In Supabase dashboard, click on **SQL Editor** (table icon in left sidebar)
2. Click "New query"
3. Copy and paste each table creation script separately:

### Create Workers Table:
```sql
CREATE TABLE workers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    work_type TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
Click **Run** to execute.

### Create Contractors Table:
```sql
CREATE TABLE contractors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    pincode TEXT,
    city TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
Click **Run** to execute.

### Create Projects Table:
```sql
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_name TEXT NOT NULL,
    contractor_name TEXT NOT NULL,
    contractor_mobile TEXT NOT NULL,
    main_skill_required TEXT NOT NULL,
    worker_count INTEGER NOT NULL,
    daily_wages TEXT,
    food_facility BOOLEAN DEFAULT FALSE,
    accommodation BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    builder_name TEXT,
    availability TEXT,
    facilities TEXT,
    ppe_kit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
Click **Run** to execute.

## Step 5: Enable Row Level Security (RLS)
1. Go to **Authentication** → **Policies** in the sidebar
2. For each table, enable RLS:

### For Workers Table:
1. Click on **workers** table
2. Toggle **Enable RLS** to ON
3. Add these policies:

**Policy 1 - Public Read Access:**
- Click "New Policy"
- Choose "For full custom permissions"
- Policy name: `Public can view workers`
- Allowed operation: `SELECT`
- Policy definition: `true`
- Click "Save"

**Policy 2 - Public Insert:**
- Click "New Policy"
- Choose "For full custom permissions"
- Policy name: `Public can insert workers`
- Allowed operation: `INSERT`
- Policy definition: `true`
- Click "Save"

### For Contractors Table:
1. Click on **contractors** table
2. Toggle **Enable RLS** to ON
3. Add same two policies as above (replace "workers" with "contractors")

### For Projects Table:
1. Click on **projects** table
2. Toggle **Enable RLS** to ON
3. Add same two policies as above (replace "workers" with "projects")

## Step 6: Test Your Setup
1. Open your `index.html` in a web browser
2. Try registering a worker:
   - Click "मैं मजदूर हूँ" button
   - Fill out the form and submit
3. Check Supabase dashboard:
   - Go to **Table Editor**
   - Click on **workers** table
   - You should see your submitted data!

4. Try posting a project:
   - Click "I need Workers" button
   - Fill out the contractor form and submit
5. Check both **contractors** and **projects** tables for your data

## Step 7: Verify Everything Works
- ✅ Workers can register and data appears in `workers` table
- ✅ Contractors can post projects and data appears in `contractors` and `projects` tables
- ✅ No errors in browser console (press F12 to check)
- ✅ Forms still work with localStorage backup

## Troubleshooting

### Common Issues:
1. **"CORS error"**: Make sure you're using http://localhost or a live server
2. **"Invalid URL"**: Double-check your SUPABASE_URL in config file
3. **"Permission denied"**: Ensure RLS policies are correctly set
4. **"Table not found"**: Verify table names match exactly (workers, contractors, projects)

### Debug Steps:
1. Open browser console (F12)
2. Look for error messages
3. Check network tab for failed requests
4. Verify Supabase credentials are correct

## Next Steps
Once everything is working:
1. Consider adding user authentication
2. Implement data validation
3. Add file upload for worker photos
4. Create admin dashboard to view all submissions

Your WorkMandi application is now fully integrated with Supabase! 🎉
