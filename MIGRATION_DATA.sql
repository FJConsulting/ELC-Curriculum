-- ================================================
-- Script de migration des données mockées
-- ================================================
-- À exécuter APRÈS avoir créé les utilisateurs dans Supabase Auth

-- 1. INSERTION DES CATÉGORIES
-- ================================================
INSERT INTO course_categories (name, description, icon, color) VALUES
  ('Business English', 'Anglais professionnel pour le monde des affaires', '💼', 'blue'),
  ('Travel English', 'Anglais pratique pour voyager', '✈️', 'green'),
  ('Daily Conversation', 'Conversation quotidienne et pratique', '💬', 'purple'),
  ('Grammar Focus', 'Focus sur la grammaire et la structure', '📚', 'orange'),
  ('Exam Preparation', 'Préparation aux examens (TOEFL, IELTS)', '🎯', 'red'),
  ('Business Writing', 'Rédaction professionnelle en anglais', '✍️', 'indigo')
ON CONFLICT DO NOTHING;

-- 2. INSERTION DES SESSIONS DE TEST
-- ================================================
-- Note: Remplacez 'teacher_id_here' par l'ID réel du professeur créé dans Supabase Auth

INSERT INTO sessions (name, description, category_id, teacher_id, type, level, date_time, meeting_link, max_students, price_tokens) VALUES
  -- Sessions pour la semaine prochaine
  ('Business Meeting Basics', 'Apprenez le vocabulaire essentiel pour les réunions professionnelles', 1, NULL, 'course', 'B1', CURRENT_TIMESTAMP + INTERVAL '7 days', 'https://meet.google.com/abc-defg-hij', 5, 1),
  ('Present Perfect Workshop', 'Atelier intensif sur le present perfect', 4, NULL, 'grammar', 'B1', CURRENT_TIMESTAMP + INTERVAL '8 days', 'https://meet.google.com/xyz-uvw-rst', 8, 1),
  ('Travel Conversations', 'Pratiquez l''anglais pour vos voyages', 2, NULL, 'conversation', 'A2', CURRENT_TIMESTAMP + INTERVAL '9 days', 'https://meet.google.com/klm-nop-qrs', 4, 1),
  
  -- Sessions supplémentaires
  ('Email Writing Workshop', 'Rédigez des emails professionnels efficaces', 6, NULL, 'course', 'B2', CURRENT_TIMESTAMP + INTERVAL '10 days', 'https://meet.google.com/aaa-bbb-ccc', 6, 1),
  ('Small Talk Practice', 'Maîtrisez l''art de la conversation informelle', 3, NULL, 'conversation', 'A1', CURRENT_TIMESTAMP + INTERVAL '11 days', 'https://meet.google.com/ddd-eee-fff', 5, 1),
  ('IELTS Speaking Prep', 'Préparation intensive pour l''oral IELTS', 5, NULL, 'course', 'C1', CURRENT_TIMESTAMP + INTERVAL '12 days', 'https://meet.google.com/ggg-hhh-iii', 3, 2),
  
  -- Sessions passées (pour l'historique)
  ('Past Tenses Review', 'Révision complète des temps du passé', 4, NULL, 'grammar', 'A2', CURRENT_TIMESTAMP - INTERVAL '7 days', 'https://meet.google.com/jjj-kkk-lll', 6, 1),
  ('Job Interview Skills', 'Préparez-vous aux entretiens en anglais', 1, NULL, 'course', 'B2', CURRENT_TIMESTAMP - INTERVAL '14 days', 'https://meet.google.com/mmm-nnn-ooo', 4, 1);

-- 3. CRÉATION D'UN ADMIN DE TEST
-- ================================================
-- Après avoir créé un utilisateur admin@elc.com dans Supabase Auth, exécutez :
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@elc.com');

-- 4. DONNÉES D'ÉVALUATIONS
-- ================================================
INSERT INTO evaluations (name, description, type, level, duration_minutes, passing_score, prerequisite_grammar_completion) VALUES
  ('Test de niveau initial', 'Évaluez votre niveau d''anglais actuel', 'initial', NULL, 30, 0, 0),
  ('Évaluation A1 → A2', 'Passez au niveau A2', 'level', 'A1', 45, 80, 80),
  ('Évaluation A2 → B1', 'Passez au niveau B1', 'level', 'A2', 45, 80, 80),
  ('Évaluation B1 → B2', 'Passez au niveau B2', 'level', 'B1', 60, 80, 80),
  ('Évaluation B2 → C1', 'Passez au niveau C1', 'level', 'B2', 60, 80, 80),
  ('Certification ELC Academy', 'Obtenez votre certificat final', 'final', 'C1', 90, 85, 100);

-- 5. QUESTIONS D'ÉVALUATION (Exemple pour le test initial)
-- ================================================
INSERT INTO evaluation_questions (evaluation_id, question, options, correct_answer, order_index) VALUES
  (1, 'What ___ your name?', '["is", "are", "am", "be"]', 0, 1),
  (1, 'I ___ from France.', '["is", "are", "am", "be"]', 2, 2),
  (1, 'She ___ to work every day.', '["go", "goes", "going", "gone"]', 1, 3),
  (1, 'They ___ studying English.', '["is", "are", "am", "be"]', 1, 4),
  (1, 'I have ___ brother and two sisters.', '["a", "an", "the", "no article"]', 0, 5);

-- 6. RESSOURCES DE TEST
-- ================================================
INSERT INTO resources (session_id, name, type, url, size) VALUES
  (1, 'Business Vocabulary PDF', 'pdf', '/resources/business-vocab.pdf', 2048),
  (1, 'Meeting Phrases Audio', 'audio', '/resources/meeting-phrases.mp3', 5120),
  (2, 'Present Perfect Guide', 'pdf', '/resources/present-perfect.pdf', 1536),
  (3, 'Travel Dialogue Video', 'video', '/resources/travel-dialogue.mp4', 10240);

-- 7. ABONNEMENTS DE TEST
-- ================================================
-- À exécuter après avoir créé des utilisateurs étudiants
-- INSERT INTO subscriptions (user_id, plan, expires_at, tokens_per_month) 
-- VALUES 
--   ('student_id_here', '4months', CURRENT_TIMESTAMP + INTERVAL '4 months', 4),
--   ('student_id_here', '6months', CURRENT_TIMESTAMP + INTERVAL '6 months', 6);

-- ================================================
-- FIN DU SCRIPT DE MIGRATION
-- ================================================ 