-- ========================================
-- Script d'initialisation ELC Academy
-- ========================================

-- 1. TABLES PRINCIPALES
-- ========================================

-- Table profiles (extension de auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  level TEXT DEFAULT 'A1' CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  tokens INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table course_categories
CREATE TABLE IF NOT EXISTS course_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table sessions
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES course_categories(id),
  teacher_id UUID REFERENCES profiles(id),
  type TEXT CHECK (type IN ('course', 'grammar', 'conversation')),
  level TEXT CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60,
  max_students INTEGER DEFAULT 5,
  price_tokens INTEGER DEFAULT 1,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table bookings
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- Table resources
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('pdf', 'video', 'audio', 'document')),
  url TEXT NOT NULL,
  size INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('4months', '6months')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  tokens_per_month INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table evaluations
CREATE TABLE IF NOT EXISTS evaluations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('initial', 'level', 'final')),
  level TEXT CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', NULL)),
  duration_minutes INTEGER DEFAULT 30,
  passing_score INTEGER DEFAULT 80,
  prerequisite_grammar_completion INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table evaluation_questions
CREATE TABLE IF NOT EXISTS evaluation_questions (
  id SERIAL PRIMARY KEY,
  evaluation_id INTEGER REFERENCES evaluations(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table user_evaluations (résultats des évaluations)
CREATE TABLE IF NOT EXISTS user_evaluations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  evaluation_id INTEGER REFERENCES evaluations(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, evaluation_id)
);

-- 2. ACTIVER RLS (Row Level Security)
-- ========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_evaluations ENABLE ROW LEVEL SECURITY;

-- 3. POLITIQUES DE SÉCURITÉ
-- ========================================

-- Policies pour profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Policies pour course_categories
CREATE POLICY "Categories are viewable by everyone" 
ON course_categories FOR SELECT 
USING (true);

CREATE POLICY "Only admin can manage categories" 
ON course_categories FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policies pour sessions
CREATE POLICY "Sessions are viewable by everyone" 
ON sessions FOR SELECT 
USING (true);

CREATE POLICY "Admin and teachers can manage sessions" 
ON sessions FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

CREATE POLICY "Admin and teachers can update sessions" 
ON sessions FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

-- Policies pour bookings
CREATE POLICY "Users can view own bookings" 
ON bookings FOR SELECT 
USING (
  student_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

CREATE POLICY "Users can create own bookings" 
ON bookings FOR INSERT 
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update own bookings" 
ON bookings FOR UPDATE 
USING (student_id = auth.uid());

-- Policies pour resources
CREATE POLICY "Resources are viewable by authenticated users" 
ON resources FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin and teachers can manage resources" 
ON resources FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

-- Policies pour subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON subscriptions FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Only admin can manage subscriptions" 
ON subscriptions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policies pour evaluations
CREATE POLICY "Evaluations are viewable by everyone" 
ON evaluations FOR SELECT 
USING (true);

CREATE POLICY "Only admin can manage evaluations" 
ON evaluations FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policies pour evaluation_questions
CREATE POLICY "Questions viewable by authenticated users" 
ON evaluation_questions FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admin can manage questions" 
ON evaluation_questions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policies pour user_evaluations
CREATE POLICY "Users can view own evaluation results" 
ON user_evaluations FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

CREATE POLICY "Users can create own evaluation results" 
ON user_evaluations FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- 4. FONCTIONS ET TRIGGERS
-- ========================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour profiles
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour créer automatiquement un profil après inscription
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, level, tokens)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'student',
    'A1',
    3
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil automatiquement
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Fonction pour réserver une session
CREATE OR REPLACE FUNCTION book_session(p_session_id INTEGER)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_user_tokens INTEGER;
  v_session_price INTEGER;
  v_spots_taken INTEGER;
  v_max_students INTEGER;
BEGIN
  -- Vérifier que l'utilisateur est connecté
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Utilisateur non connecté');
  END IF;

  -- Vérifier les tokens de l'utilisateur
  SELECT tokens INTO v_user_tokens FROM profiles WHERE id = v_user_id;
  
  -- Vérifier le prix et la disponibilité de la session
  SELECT price_tokens, max_students 
  INTO v_session_price, v_max_students 
  FROM sessions 
  WHERE id = p_session_id;
  
  -- Compter les réservations existantes
  SELECT COUNT(*) INTO v_spots_taken 
  FROM bookings 
  WHERE session_id = p_session_id 
  AND status = 'confirmed';
  
  -- Vérifier s'il reste des places
  IF v_spots_taken >= v_max_students THEN
    RETURN json_build_object('success', false, 'error', 'Session complète');
  END IF;
  
  -- Vérifier les tokens suffisants
  IF v_user_tokens < v_session_price THEN
    RETURN json_build_object('success', false, 'error', 'Tokens insuffisants');
  END IF;
  
  -- Créer la réservation
  INSERT INTO bookings (session_id, student_id) VALUES (p_session_id, v_user_id);
  
  -- Déduire les tokens
  UPDATE profiles SET tokens = tokens - v_session_price WHERE id = v_user_id;
  
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object('success', false, 'error', 'Déjà inscrit à cette session');
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. DONNÉES DE TEST
-- ========================================

-- Insérer des catégories
INSERT INTO course_categories (name, description, icon, color) VALUES
  ('Business English', 'Anglais professionnel', '💼', 'blue'),
  ('Travel English', 'Anglais pour voyager', '✈️', 'green'),
  ('Daily Conversation', 'Conversation quotidienne', '💬', 'purple'),
  ('Grammar Focus', 'Focus grammaire', '📚', 'orange')
ON CONFLICT DO NOTHING;

-- 6. CRÉER UN BUCKET STORAGE POUR LES RESSOURCES
-- ========================================

-- À exécuter dans l'interface Supabase Storage ou via API
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('resources', 'resources', true);

-- 7. CRÉER LES INDEX POUR LES PERFORMANCES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_sessions_date_time ON sessions(date_time);
CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type);
CREATE INDEX IF NOT EXISTS idx_sessions_level ON sessions(level);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session_id ON bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_resources_session_id ON resources(session_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_type ON evaluations(type);
CREATE INDEX IF NOT EXISTS idx_evaluations_level ON evaluations(level);
CREATE INDEX IF NOT EXISTS idx_user_evaluations_user_id ON user_evaluations(user_id);

-- ========================================
-- FIN DU SCRIPT D'INITIALISATION
-- ========================================

-- Pour créer un admin de test, exécutez ces commandes séparément après avoir créé un utilisateur :
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@elc.com'; 