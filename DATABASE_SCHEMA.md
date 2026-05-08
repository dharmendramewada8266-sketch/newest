# WorkMandi Database Schema (Supabase)

## Setup Instructions

1. Create a new Supabase project at https://supabase.com
2. Replace the placeholder values in `supabase-config.js`:
   - `YOUR_SUPABASE_URL` with your Supabase project URL
   - `YOUR_SUPABASE_ANON_KEY` with your Supabase anonymous key

## Database Tables

### 1. Workers Table
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

**Fields:**
- `id`: Unique identifier (auto-generated)
- `name`: Worker's full name
- `work_type`: Type of work (e.g., "Mason", "Carpenter", "Electrician")
- `city`: City where worker is located
- `phone`: Worker's phone number
- `experience`: Years of experience or skill level
- `verified`: Whether worker is verified (true for verified workers)
- `created_at`: Timestamp when record was created

### 2. Contractors Table
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

**Fields:**
- `id`: Unique identifier (auto-generated)
- `name`: Contractor's name or company name
- `mobile`: Contractor's mobile number
- `email`: Contractor's email address
- `pincode`: Area pincode
- `city`: City where contractor operates
- `address`: Full address
- `created_at`: Timestamp when record was created

### 3. Projects Table
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
    site_image_url TEXT,
    location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier (auto-generated)
- `project_name`: Name of the construction project
- `contractor_name`: Name of the contractor posting the project
- `contractor_mobile`: Contractor's mobile number
- `main_skill_required`: Primary skill needed (e.g., "Mason")
- `worker_count`: Number of workers needed
- `daily_wages`: Daily wage amount
- `food_facility`: Whether food is provided
- `accommodation`: Whether accommodation is provided
- `start_date`: Project start date
- `end_date`: Project end date
- `builder_name`: Name of the builder
- `availability`: Availability status
- `facilities`: Comma-separated list of facilities
- `ppe_kit`: Whether PPE kit is provided
- `site_image_url`: URL to the project site photo
- `location`: Full address or location description for the project site
- `created_at`: Timestamp when record was created

### 4. Applications Table
```sql
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id),
    worker_name TEXT NOT NULL,
    worker_phone TEXT,
    worker_email TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier (auto-generated)
- `project_id`: Foreign key reference to the projects table
- `worker_name`: Name of the worker applying
- `worker_phone`: Worker's phone number (optional)
- `worker_email`: Worker's email address (optional)
- `message`: Additional message from worker (optional)
- `status`: Application status ('pending', 'accepted', 'rejected')
- `created_at`: Timestamp when application was submitted

## Row Level Security (RLS) Policies

Enable RLS on all tables and add these policies:

### Workers Table
```sql
-- Allow public read access
CREATE POLICY "Public can view workers" ON workers FOR SELECT USING (true);

-- Allow public insert (for worker registration)
CREATE POLICY "Public can insert workers" ON workers FOR INSERT WITH CHECK (true);

-- Allow users to update their own records (if you add authentication later)
CREATE POLICY "Users can update own workers" ON workers FOR UPDATE USING (auth.uid()::text = phone);
```

### Contractors Table
```sql
-- Allow public read access
CREATE POLICY "Public can view contractors" ON contractors FOR SELECT USING (true);

-- Allow public insert (for contractor registration)
CREATE POLICY "Public can insert contractors" ON contractors FOR INSERT WITH CHECK (true);

-- Allow users to update their own records
CREATE POLICY "Users can update own contractors" ON contractors FOR UPDATE USING (auth.uid()::text = mobile);
```

### Projects Table
```sql
-- Allow public read access
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);

-- Allow public insert (for project posting)
CREATE POLICY "Public can insert projects" ON projects FOR INSERT WITH CHECK (true);

-- Allow users to update their own projects
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid()::text = contractor_mobile);
```

### Applications Table
```sql
-- Allow public read access
CREATE POLICY "Public can view applications" ON applications FOR SELECT USING (true);

-- Allow public insert (for job applications)
CREATE POLICY "Public can insert applications" ON applications FOR INSERT WITH CHECK (true);

-- Allow users to update their own applications
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid()::text = worker_phone);
```

## Usage

The application will automatically:
- Save worker registrations to the `workers` table
- Save contractor information to the `contractors` table
- Save project postings to the `projects` table
- Maintain localStorage for offline functionality
- Provide error handling for database operations

## Data Flow

1. **Worker Registration**: Data saved to `workers` table
2. **Contractor Project Posting**: Data saved to both `contractors` and `projects` tables
3. **Job Applications**: Data saved to `applications` table with project reference
4. **Data Retrieval**: Functions available to fetch workers, contractors, projects, and applications

## Notes

- All timestamps are in UTC
- Phone numbers are stored as text to accommodate different formats
- The `verified` field in workers table indicates if worker has completed verification
- Facilities in projects table are stored as comma-separated values
