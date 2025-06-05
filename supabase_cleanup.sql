-- ========================================
-- Script de nettoyage pour Supabase
-- ========================================
-- ⚠️  ATTENTION : Ce script supprime TOUTES les données !
-- À utiliser seulement si vous voulez repartir de zéro

-- 1. SUPPRIMER TOUTES LES POLITIQUES RLS
-- ========================================

-- Supprimer les politiques pour user_evaluations
DROP POLICY IF EXISTS "Users can view own evaluation results" ON user_evaluations;
DROP POLICY IF EXISTS "Users can create own evaluation results" ON user_evaluations;

-- Supprimer les politiques pour evaluation_questions
DROP POLICY IF EXISTS "Questions viewable by authenticated users" ON evaluation_questions;
DROP POLICY IF EXISTS "Only admin can manage questions" ON evaluation_questions;

-- Supprimer les politiques pour evaluations
DROP POLICY IF EXISTS "Evaluations are viewable by everyone" ON evaluations;
DROP POLICY IF EXISTS "Only admin can manage evaluations" ON evaluations;

-- Supprimer les politiques pour subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Only admin can manage subscriptions" ON subscriptions;

-- Supprimer les politiques pour resources
DROP POLICY IF EXISTS "Resources are viewable by authenticated users" ON resources;
DROP POLICY IF EXISTS "Admin and teachers can manage resources" ON resources;

-- Supprimer les politiques pour bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Supprimer les politiques pour sessions
DROP POLICY IF EXISTS "Sessions are viewable by everyone" ON sessions;
DROP POLICY IF EXISTS "Admin and teachers can insert sessions" ON sessions;
DROP POLICY IF EXISTS "Admin and teachers can update sessions" ON sessions;

-- Supprimer les politiques pour course_categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON course_categories;
DROP POLICY IF EXISTS "Only admin can manage categories" ON course_categories;

-- Supprimer les politiques pour profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 2. SUPPRIMER LES TRIGGERS
-- ========================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- 3. SUPPRIMER LES FONCTIONS
-- ========================================

DROP FUNCTION IF EXISTS book_session(INTEGER);
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 4. SUPPRIMER TOUTES LES TABLES (dans l'ordre des dépendances)
-- ========================================

-- Tables qui dépendent d'autres tables en premier
DROP TABLE IF EXISTS user_evaluations CASCADE;
DROP TABLE IF EXISTS evaluation_questions CASCADE;
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS course_categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 5. SUPPRIMER LES INDEX (si ils existent encore)
-- ========================================

DROP INDEX IF EXISTS idx_user_evaluations_user_id;
DROP INDEX IF EXISTS idx_evaluations_level;
DROP INDEX IF EXISTS idx_evaluations_type;
DROP INDEX IF EXISTS idx_resources_session_id;
DROP INDEX IF EXISTS idx_bookings_session_id;
DROP INDEX IF EXISTS idx_bookings_student_id;
DROP INDEX IF EXISTS idx_sessions_level;
DROP INDEX IF EXISTS idx_sessions_type;
DROP INDEX IF EXISTS idx_sessions_date_time;

-- ========================================
-- Nettoyage terminé !
-- ========================================
-- Vous pouvez maintenant exécuter supabase_init.sql 