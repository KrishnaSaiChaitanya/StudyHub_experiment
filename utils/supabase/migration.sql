-- ==========================================
-- 1. ENUMS (Custom Data Types)
-- ==========================================
CREATE TYPE student_level AS ENUM ('foundation', 'intermediate', 'final');
CREATE TYPE todo_status AS ENUM ('pending', 'completed');
CREATE TYPE mcq_option AS ENUM ('A', 'B', 'C', 'D');

CREATE TYPE subject_category AS ENUM (
  -- Foundation Subjects
  'principles_and_practice_of_accounting',
  'business_laws',
  'business_math_logical_reasoning_and_statistics',
  'business_economics',
  
  -- Intermediate Subjects
  'advanced_accounting',
  'corporate_and_other_laws',
  'taxation',
  'cost_and_management_accounting',
  'auditing_and_ethics',
  'financial_management_and_strategic_management',
  
  -- Final Subjects
  'financial_reporting',
  'advanced_financial_management',
  'advanced_auditing_assurance_and_professional_ethics',
  'direct_tax_laws',
  'indirect_tax_laws',
  'integrated_business_solutions'
);

-- ==========================================
-- 2. UTILITY FUNCTIONS
-- ==========================================
-- Function to auto-update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- 3. CORE TABLES (Auth & Profiles)
-- ==========================================
-- Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_type student_level,
  current_streak INT DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 4. FACULTY & STUDY MATERIAL TABLES
-- ==========================================
CREATE TABLE public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject subject_category, -- Linked to the new Enum
  rating NUMERIC(3, 2) DEFAULT 0.00,
  students_count INT DEFAULT 0,
  level student_level,
  email TEXT UNIQUE,
  phone TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_faculty_modtime BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.faculty_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  duration_minutes INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.faculty_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sessions_count INT DEFAULT 0,
  hours_count INT DEFAULT 0,
  enrolled_count INT DEFAULT 0,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.study_planners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  faculty_id UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
  category subject_category NOT NULL,
  planner_date DATE NOT NULL,
  pages INT DEFAULT 0,
  downloads INT DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0.00,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_planners_modtime BEFORE UPDATE ON study_planners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. USER ACTIVITY TABLES
-- ==========================================
CREATE TABLE public.user_bookmarks (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  planner_id UUID REFERENCES public.study_planners(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, planner_id)
);

CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  category subject_category NOT NULL,
  duration_seconds INT NOT NULL,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category subject_category NOT NULL,
  status todo_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_todos_modtime BEFORE UPDATE ON todos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 6. TESTING ENGINE TABLES
-- ==========================================
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category subject_category NOT NULL,
  questions_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_tests_modtime BEFORE UPDATE ON tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer mcq_option NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TRIGGER update_questions_modtime BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update questions_count in tests
CREATE OR REPLACE FUNCTION update_test_question_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tests SET questions_count = questions_count + 1 WHERE id = NEW.test_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tests SET questions_count = questions_count - 1 WHERE id = OLD.test_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_test_count
  AFTER INSERT OR DELETE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_test_question_count();

CREATE TABLE public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.test_attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option mcq_option,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 7. PERFORMANCE INDEXES
-- ==========================================
CREATE INDEX idx_faculty_videos_faculty_id ON faculty_videos(faculty_id);
CREATE INDEX idx_faculty_courses_faculty_id ON faculty_courses(faculty_id);
CREATE INDEX idx_study_planners_category ON study_planners(category);
CREATE INDEX idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_questions_test_id ON questions(test_id);
CREATE INDEX idx_test_attempts_user_id ON test_attempts(user_id);
CREATE INDEX idx_test_attempts_test_id ON test_attempts(test_id);
CREATE INDEX idx_test_attempt_answers_attempt_id ON test_attempt_answers(attempt_id);

-- ==========================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ==========================================
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_planners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempt_answers ENABLE ROW LEVEL SECURITY;

-- Profiles & Subscriptions: Users can only view/edit their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = id);

-- Public Read-Only Tables (Viewable by authenticated users)
CREATE POLICY "Anyone can view faculty" ON public.faculty FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view videos" ON public.faculty_videos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view courses" ON public.faculty_courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view planners" ON public.study_planners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view tests" ON public.tests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view questions" ON public.questions FOR SELECT TO authenticated USING (true);

-- User Private Tables (CRUD operations restricted to the owner)
-- Bookmarks
CREATE POLICY "Users manage own bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);
-- Sessions
CREATE POLICY "Users manage own study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
-- Todos
CREATE POLICY "Users manage own todos" ON public.todos FOR ALL USING (auth.uid() = user_id);
-- Test Attempts
CREATE POLICY "Users manage own test attempts" ON public.test_attempts FOR ALL USING (auth.uid() = user_id);
-- Test Answers (Secured through the attempt relationship)
CREATE POLICY "Users manage own test answers" ON public.test_attempt_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.test_attempts ta WHERE ta.id = test_attempt_answers.attempt_id AND ta.user_id = auth.uid())
);