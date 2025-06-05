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

-- 2. INSERTION DES ÉVALUATIONS D'ABORD
-- ================================================
INSERT INTO evaluations (name, description, type, level, duration_minutes, passing_score, prerequisite_grammar_completion) VALUES
  ('Test de niveau initial', 'Évaluez votre niveau d''anglais actuel', 'initial', NULL, 30, 0, 0),
  ('Évaluation A1 → A2', 'Passez au niveau A2', 'level', 'A1', 45, 80, 80),
  ('Évaluation A2 → B1', 'Passez au niveau B1', 'level', 'A2', 45, 80, 80),
  ('Évaluation B1 → B2', 'Passez au niveau B2', 'level', 'B1', 60, 80, 80),
  ('Évaluation B2 → C1', 'Passez au niveau C1', 'level', 'B2', 60, 80, 80),
  ('Certification ELC Academy', 'Obtenez votre certificat final', 'final', 'C1', 90, 85, 100)
ON CONFLICT DO NOTHING;

-- 3. INSERTION DES QUESTIONS D'ÉVALUATION
-- ================================================
-- Questions pour le test de niveau initial (récupération de l'ID dynamiquement)
INSERT INTO evaluation_questions (evaluation_id, question, options, correct_answer, order_index) 
SELECT 
  e.id,
  q.question,
  q.options::jsonb,
  q.correct_answer,
  q.order_index
FROM evaluations e,
(VALUES
  ('What ___ your name?', '["is", "are", "am", "be"]', 0, 1),
  ('I ___ from France.', '["is", "are", "am", "be"]', 2, 2),
  ('She ___ to work every day.', '["go", "goes", "going", "gone"]', 1, 3),
  ('They ___ studying English.', '["is", "are", "am", "be"]', 1, 4),
  ('I have ___ brother and two sisters.', '["a", "an", "the", "no article"]', 0, 5),
  ('Where ___ you live?', '["do", "does", "are", "is"]', 0, 6),
  ('She ___ English very well.', '["speak", "speaks", "speaking", "spoke"]', 1, 7),
  ('I ___ coffee every morning.', '["drink", "drinks", "drinking", "drank"]', 0, 8),
  ('They ___ watching TV now.', '["is", "are", "am", "be"]', 1, 9),
  ('How many books ___ you have?', '["do", "does", "are", "is"]', 0, 10)
) AS q(question, options, correct_answer, order_index)
WHERE e.name = 'Test de niveau initial'
ON CONFLICT DO NOTHING;

-- Questions pour l'évaluation A1 → A2
INSERT INTO evaluation_questions (evaluation_id, question, options, correct_answer, order_index) 
SELECT 
  e.id,
  q.question,
  q.options::jsonb,
  q.correct_answer,
  q.order_index
FROM evaluations e,
(VALUES
  ('I ___ to the cinema yesterday.', '["go", "went", "going", "gone"]', 1, 1),
  ('She ___ her homework right now.', '["do", "does", "is doing", "did"]', 2, 2),
  ('We ___ lived here for 5 years.', '["have", "has", "had", "having"]', 0, 3),
  ('There ___ many people in the park.', '["is", "are", "was", "been"]', 1, 4),
  ('I ___ play tennis when I was young.', '["use to", "used to", "using to", "uses to"]', 1, 5)
) AS q(question, options, correct_answer, order_index)
WHERE e.name = 'Évaluation A1 → A2'
ON CONFLICT DO NOTHING;

-- 4. INSERTION DES SESSIONS DE TEST
-- ================================================
-- Note: teacher_id sera mis à jour après création des professeurs

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

-- 5. RESSOURCES DE TEST
-- ================================================
-- Note: les session_id seront automatiquement assignés selon l'ordre d'insertion
INSERT INTO resources (session_id, name, type, url, size) 
SELECT 
  s.id,
  r.name,
  r.type,
  r.url,
  r.size
FROM sessions s,
(VALUES
  ('Business Meeting Basics', 'Business Vocabulary PDF', 'pdf', '/resources/business-vocab.pdf', 2048),
  ('Business Meeting Basics', 'Meeting Phrases Audio', 'audio', '/resources/meeting-phrases.mp3', 5120),
  ('Present Perfect Workshop', 'Present Perfect Guide', 'pdf', '/resources/present-perfect.pdf', 1536),
  ('Travel Conversations', 'Travel Dialogue Video', 'video', '/resources/travel-dialogue.mp4', 10240),
  ('Email Writing Workshop', 'Email Templates', 'pdf', '/resources/email-templates.pdf', 1024),
  ('IELTS Speaking Prep', 'IELTS Speaking Guide', 'pdf', '/resources/ielts-speaking.pdf', 3072)
) AS r(session_name, name, type, url, size)
WHERE s.name = r.session_name;

-- 6. COMMANDES POST-INSERTION
-- ================================================

-- Après avoir créé un utilisateur admin@elc.com dans Supabase Auth, exécutez :
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@elc.com');

-- Après avoir créé des professeurs, assignez-les aux sessions :
-- UPDATE sessions SET teacher_id = (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1) WHERE teacher_id IS NULL;

-- Pour créer des abonnements de test (après avoir créé des étudiants) :
-- INSERT INTO subscriptions (user_id, plan, expires_at, tokens_per_month) 
-- SELECT id, '4months', CURRENT_TIMESTAMP + INTERVAL '4 months', 4
-- FROM profiles WHERE role = 'student' LIMIT 2;

-- ================================================
-- FIN DU SCRIPT DE MIGRATION
-- ================================================ 