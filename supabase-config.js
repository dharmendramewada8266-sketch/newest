// Supabase Configuration
// Prefer injecting via `window.__SUPABASE_CONFIG__` at deploy time.
const runtimeSupabaseConfig = window.__SUPABASE_CONFIG__ || {};
const SUPABASE_URL = runtimeSupabaseConfig.url || 'https://gcqpabughvzmlqcozxtw.supabase.co';
const SUPABASE_ANON_KEY = runtimeSupabaseConfig.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjcXBhYnVnaHZ6bWxxY296eHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NzAyMjksImV4cCI6MjA5MDU0NjIyOX0.hrVbLJrmrPelS-Bc8aNBr9RJHGEk5o99nx8ht6lS-Hs';

// Initialize Supabase client safely
const { createClient } = supabase || {};
const isSupabaseConfigured = Boolean(createClient && SUPABASE_URL && SUPABASE_ANON_KEY);
const supabaseClient = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Database table names
const TABLES = {
    WORKERS: 'workers',
    CONTRACTORS: 'contractors',
    PROJECTS: 'projects',
    APPLICATIONS: 'applications'
};

const STORAGE_BUCKETS = {
    WORKER_DOCUMENTS: 'worker-documents',
    PROJECT_MEDIA: 'project-media'
};

function sanitizeError(error, fallbackMessage) {
    if (!error) return fallbackMessage;
    if (typeof error === 'string') return error;
    return error.message || fallbackMessage;
}

async function withDbErrorHandling(operation, fallbackMessage) {
    try {
        if (!supabaseClient) {
            throw new Error('Supabase is not configured.');
        }
        const { data, error } = await operation();
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error(fallbackMessage, error);
        return { success: false, error: sanitizeError(error, fallbackMessage) };
    }
}

function buildSafeFileName(prefix, file) {
    const rawName = file?.name || 'upload';
    const ext = rawName.includes('.') ? rawName.split('.').pop() : 'bin';
    const safeExt = String(ext).toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
    return `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
}

// Helper functions for database operations
const dbOperations = {
    // Save worker data
    async saveWorker(workerData) {
        return withDbErrorHandling(
            () => supabaseClient
                .from(TABLES.WORKERS)
                .insert([workerData]),
            'Error saving worker'
        );
    },

    // Save contractor data
    async saveContractor(contractorData) {
        return withDbErrorHandling(
            () => supabaseClient
                .from(TABLES.CONTRACTORS)
                .insert([contractorData]),
            'Error saving contractor'
        );
    },

    // Save project data
    async saveProject(projectData) {
        return withDbErrorHandling(
            () => supabaseClient
                .from(TABLES.PROJECTS)
                .insert([projectData]),
            'Error saving project'
        );
    },

    // Get all workers
    async getWorkers() {
        return withDbErrorHandling(
            () => supabaseClient
                .from(TABLES.WORKERS)
                .select('*'),
            'Error fetching workers'
        );
    },

    // Get all contractors
    async getContractors() {
        return withDbErrorHandling(
            () => supabaseClient
                .from(TABLES.CONTRACTORS)
                .select('*'),
            'Error fetching contractors'
        );
    },

    // Get all projects
    async getProjects() {
        return withDbErrorHandling(
            () => supabaseClient
                .from(TABLES.PROJECTS)
                .select('*')
                .order('created_at', { ascending: false }),
            'Error fetching projects'
        );
    },

    // Save application data
    async saveApplication(applicationData) {
        return withDbErrorHandling(
            () => supabaseClient
                .from(TABLES.APPLICATIONS)
                .insert([applicationData]),
            'Error saving application'
        );
    },

    async uploadFile(file, bucketName, folder = 'uploads') {
        return withDbErrorHandling(async () => {
            const filePath = buildSafeFileName(folder, file);
            const uploadResult = await supabaseClient.storage.from(bucketName).upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });
            if (uploadResult.error) throw uploadResult.error;

            const { data } = supabaseClient.storage.from(bucketName).getPublicUrl(filePath);
            return { path: filePath, publicUrl: data?.publicUrl || null };
        }, 'Error uploading file');
    }
};

window.appConfig = {
    isSupabaseConfigured,
    SUPABASE_URL
};

window.STORAGE_BUCKETS = STORAGE_BUCKETS;
