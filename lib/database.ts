import { createClient } from "@supabase/supabase-js"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error(
    "Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in your environment variables.",
  )
}

if (!supabaseKey) {
  throw new Error(
    "Missing Supabase Anon Key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY in your environment variables.",
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  department?: string
  student_id?: string
  created_at: string
  updated_at: string
}

export interface QuizResult {
  id: string
  user_id: string
  subject: string
  topic: string
  score: number
  total_questions: number
  completed_at: string
  time_taken: number // in seconds
}

export interface LearningProgress {
  id: string
  user_id: string
  subject: string
  topic: string
  progress_percentage: number
  last_accessed: string
  time_spent: number // in minutes
}

export interface UserSettings {
  id: string
  user_id: string
  notifications_enabled: boolean
  default_difficulty: string
  preferred_chart_type: string
  study_goal: number
  updated_at: string
}

// User management functions
export async function createUser(email: string, name: string, department?: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          name,
          department,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error creating user:", error)
    return { data: null, error }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { data: null, error }
  }
}

export async function updateUser(userId: string, updates: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error updating user:", error)
    return { data: null, error }
  }
}

// Quiz results functions
export async function saveQuizResult(result: Omit<QuizResult, "id">) {
  try {
    const { data, error } = await supabase
      .from("quiz_results")
      .insert([
        {
          ...result,
          completed_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error saving quiz result:", error)
    return { data: null, error }
  }
}

export async function getQuizResults(userId: string, subject?: string) {
  try {
    let query = supabase
      .from("quiz_results")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })

    if (subject) {
      query = query.eq("subject", subject)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error fetching quiz results:", error)
    return { data: null, error }
  }
}

// Learning progress functions
export async function updateLearningProgress(progress: Omit<LearningProgress, "id">) {
  try {
    const { data, error } = await supabase
      .from("learning_progress")
      .upsert(
        [
          {
            ...progress,
            last_accessed: new Date().toISOString(),
          },
        ],
        {
          onConflict: "user_id,subject,topic",
        },
      )
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error updating learning progress:", error)
    return { data: null, error }
  }
}

export async function getLearningProgress(userId: string) {
  try {
    const { data, error } = await supabase
      .from("learning_progress")
      .select("*")
      .eq("user_id", userId)
      .order("last_accessed", { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error fetching learning progress:", error)
    return { data: null, error }
  }
}

// Settings functions
export async function saveUserSettings(settings: Omit<UserSettings, "id">) {
  try {
    const { data, error } = await supabase
      .from("user_settings")
      .upsert(
        [
          {
            ...settings,
            updated_at: new Date().toISOString(),
          },
        ],
        {
          onConflict: "user_id",
        },
      )
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error saving user settings:", error)
    return { data: null, error }
  }
}

export async function getUserSettings(userId: string) {
  try {
    const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return { data: null, error }
  }
}

// Simple authentication functions for development
export async function authenticateUser(email: string, password: string) {
  try {
    // For development, we'll just check if user exists
    // In production, you should use proper authentication
    const { data: user } = await getUserByEmail(email)

    if (user) {
      return { data: user, error: null }
    } else {
      return { data: null, error: new Error("User not found") }
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return { data: null, error }
  }
}

// Test connection function
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)
    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return { success: false, error }
  }
}
