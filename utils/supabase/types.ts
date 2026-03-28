// ==========================================
// 1. ENUMS (Mapped as String Unions for TS)
// ==========================================

export type StudentLevel = 'foundation' | 'intermediate' | 'final';

export type TodoStatus = 'pending' | 'completed';

export type McqOption = 'A' | 'B' | 'C' | 'D';

export type SubjectCategory = 
  | 'general'
  // Foundation
  | 'principles_and_practice_of_accounting'
  | 'business_laws'
  | 'business_math_logical_reasoning_and_statistics'
  | 'business_economics'
  // Intermediate
  | 'advanced_accounting'
  | 'corporate_and_other_laws'
  | 'taxation'
  | 'cost_and_management_accounting'
  | 'auditing_and_ethics'
  | 'financial_management_and_strategic_management'
  // Final
  | 'financial_reporting'
  | 'advanced_financial_management'
  | 'advanced_auditing_assurance_and_professional_ethics'
  | 'direct_tax_laws'
  | 'indirect_tax_laws'
  | 'integrated_business_solutions';

// ==========================================
// 2. TABLE ROW TYPES
// ==========================================

export interface Profile {
  id: string; // UUID from auth.users
  student_type: StudentLevel | null;
  current_streak: number;
  last_active_date: string | null; // 'YYYY-MM-DD'
  created_at: string; // ISO String
  updated_at: string;
}

export interface Subscription {
  id: string; // UUID
  razorpay_subscription_id: string | null;
  razorpay_customer_id: string | null;
  plan_id: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: string; // UUID
  name: string;
  subject: SubjectCategory | null;
  rating: number;
  students_count: number;
  level: StudentLevel | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface FacultyVideo {
  id: string; // UUID
  faculty_id: string; // UUID
  name: string;
  url: string;
  duration_minutes: number | null;
  created_at: string;
}

export interface FacultyCourse {
  id: string; // UUID
  faculty_id: string; // UUID
  name: string;
  sessions_count: number;
  hours_count: number;
  enrolled_count: number;
  price: number;
  created_at: string;
}

export interface StudyPlanner {
  id: string; // UUID
  title: string;
  faculty_id: string | null; // UUID
  category: SubjectCategory;
  planner_date: string; // 'YYYY-MM-DD'
  pages: number;
  downloads: number;
  rating: number;
  pdf_url: string;
  created_at: string;
  updated_at: string;
}

export interface UserBookmark {
  user_id: string; // UUID
  planner_id: string; // UUID
  created_at: string;
}

export interface StudySession {
  id: string; // UUID
  user_id: string; // UUID
  category: SubjectCategory;
  duration_seconds: number;
  session_date: string; // 'YYYY-MM-DD'
  created_at: string;
}

export interface Todo {
  id: string; // UUID
  user_id: string; // UUID
  description: string;
  category: SubjectCategory;
  status: TodoStatus;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string; // UUID
  name: string;
  category: SubjectCategory;
  questions_count: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string; // UUID
  test_id: string; // UUID
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: McqOption;
  created_at: string;
  updated_at: string;
}

export interface TestAttempt {
  id: string; // UUID
  user_id: string; // UUID
  test_id: string; // UUID
  score: number;
  total_questions: number;
  completed_at: string;
}

export interface TestAttemptAnswer {
  id: string; // UUID
  attempt_id: string; // UUID
  question_id: string; // UUID
  selected_option: McqOption | null; // Nullable if they skipped the question
  is_correct: boolean;
  created_at: string;
}

export interface SubjectMeetLink {
  subject_id: string; // From SubjectCategory
  meet_url: string;
  updated_at: string;
}

// ==========================================
// 3. SUPABASE DATABASE INTERFACE
// ==========================================
// You can pass this to your Supabase client to type-check your queries:
// const supabase = createClient<Database>(url, key)

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      subscriptions: { Row: Subscription; Insert: Partial<Subscription>; Update: Partial<Subscription> };
      faculty: { Row: Faculty; Insert: Partial<Faculty>; Update: Partial<Faculty> };
      faculty_videos: { Row: FacultyVideo; Insert: Partial<FacultyVideo>; Update: Partial<FacultyVideo> };
      faculty_courses: { Row: FacultyCourse; Insert: Partial<FacultyCourse>; Update: Partial<FacultyCourse> };
      study_planners: { Row: StudyPlanner; Insert: Partial<StudyPlanner>; Update: Partial<StudyPlanner> };
      user_bookmarks: { Row: UserBookmark; Insert: Partial<UserBookmark>; Update: Partial<UserBookmark> };
      study_sessions: { Row: StudySession; Insert: Partial<StudySession>; Update: Partial<StudySession> };
      todos: { Row: Todo; Insert: Partial<Todo>; Update: Partial<Todo> };
      tests: { Row: Test; Insert: Partial<Test>; Update: Partial<Test> };
      questions: { Row: Question; Insert: Partial<Question>; Update: Partial<Question> };
      test_attempts: { Row: TestAttempt; Insert: Partial<TestAttempt>; Update: Partial<TestAttempt> };
      test_attempt_answers: { Row: TestAttemptAnswer; Insert: Partial<TestAttemptAnswer>; Update: Partial<TestAttemptAnswer> };
      subject_meet_links: { Row: SubjectMeetLink; Insert: Partial<SubjectMeetLink>; Update: Partial<SubjectMeetLink> };
    };
    Enums: {
      student_level: StudentLevel;
      todo_status: TodoStatus;
      mcq_option: McqOption;
      subject_category: SubjectCategory;
    };
  };
}