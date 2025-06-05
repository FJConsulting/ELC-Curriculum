-- ========================================================
-- SCRIPT DE DONNÉES COMPLÈTES POUR ELC ACADÉMIE EN LIGNE
-- ========================================================
-- Ce script ajoute des données réalistes pour toutes les tables
-- de la base de données Supabase de l'application ELC Académie en ligne.
-- À exécuter APRÈS avoir créé les tables avec supabase_init.sql

-- Désactiver temporairement les contraintes de clé étrangère
SET session_replication_role = 'replica';

-- ========================================================
-- 1. DONNÉES POUR LES UTILISATEURS (PROFILES)
-- ========================================================

-- Administrateurs
INSERT INTO profiles (id, name, role, level, tokens, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Admin Principal', 'admin', 'C1', 999, NOW() - INTERVAL '6 months', NOW()),
('00000000-0000-0000-0000-000000000002', 'Directeur Pédagogique', 'admin', 'C1', 999, NOW() - INTERVAL '5 months', NOW())
ON CONFLICT (id) DO NOTHING;

-- Professeurs
INSERT INTO profiles (id, name, role, level, tokens, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000101', 'Marie Dupont', 'teacher', 'C1', 50, NOW() - INTERVAL '6 months', NOW()),
('00000000-0000-0000-0000-000000000102', 'Jean Martin', 'teacher', 'C1', 50, NOW() - INTERVAL '5 months', NOW()),
('00000000-0000-0000-0000-000000000103', 'Sophie Leclerc', 'teacher', 'C1', 50, NOW() - INTERVAL '4 months', NOW()),
('00000000-0000-0000-0000-000000000104', 'Thomas Bernard', 'teacher', 'C1', 50, NOW() - INTERVAL '3 months', NOW()),
('00000000-0000-0000-0000-000000000105', 'Claire Dubois', 'teacher', 'C1', 50, NOW() - INTERVAL '2 months', NOW())
ON CONFLICT (id) DO NOTHING;

-- Étudiants (niveau A1)
INSERT INTO profiles (id, name, role, level, tokens, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000201', 'Lucas Petit', 'student', 'A1', 8, NOW() - INTERVAL '6 months', NOW()),
('00000000-0000-0000-0000-000000000202', 'Emma Roux', 'student', 'A1', 5, NOW() - INTERVAL '6 months', NOW()),
('00000000-0000-0000-0000-000000000203', 'Noah Moreau', 'student', 'A1', 3, NOW() - INTERVAL '5 months', NOW()),
('00000000-0000-0000-0000-000000000204', 'Chloé Fournier', 'student', 'A1', 2, NOW() - INTERVAL '5 months', NOW()),
('00000000-0000-0000-0000-000000000205', 'Louis Girard', 'student', 'A1', 4, NOW() - INTERVAL '4 months', NOW()),
('00000000-0000-0000-0000-000000000206', 'Jade Lambert', 'student', 'A1', 6, NOW() - INTERVAL '3 months', NOW()),
('00000000-0000-0000-0000-000000000207', 'Gabriel Bonnet', 'student', 'A1', 1, NOW() - INTERVAL '2 months', NOW()),
('00000000-0000-0000-0000-000000000208', 'Louise Mercier', 'student', 'A1', 3, NOW() - INTERVAL '1 month', NOW())
ON CONFLICT (id) DO NOTHING;

-- Étudiants (niveau A2)
INSERT INTO profiles (id, name, role, level, tokens, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000301', 'Raphaël Durand', 'student', 'A2', 7, NOW() - INTERVAL '6 months', NOW()),
('00000000-0000-0000-0000-000000000302', 'Alice Leroy', 'student', 'A2', 4, NOW() - INTERVAL '5 months', NOW()),
('00000000-0000-0000-0000-000000000303', 'Arthur Morel', 'student', 'A2', 6, NOW() - INTERVAL '5 months', NOW()),
('00000000-0000-0000-0000-000000000304', 'Léa Simon', 'student', 'A2', 2, NOW() - INTERVAL '4 months', NOW()),
('00000000-0000-0000-0000-000000000305', 'Hugo Lefebvre', 'student', 'A2', 5, NOW() - INTERVAL '3 months', NOW()),
('00000000-0000-0000-0000-000000000306', 'Manon Michel', 'student', 'A2', 3, NOW() - INTERVAL '2 months', NOW())
ON CONFLICT (id) DO NOTHING;
-- Étudiants (niveau B1)
INSERT INTO profiles (id, name, role, level, tokens, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000401', 'Jules Bertrand', 'student', 'B1', 9, NOW() - INTERVAL '6 months', NOW()),
('00000000-0000-0000-0000-000000000402', 'Camille Garnier', 'student', 'B1', 6, NOW() - INTERVAL '5 months', NOW()),
('00000000-0000-0000-0000-000000000403', 'Adam Faure', 'student', 'B1', 4, NOW() - INTERVAL '4 months', NOW()),
('00000000-0000-0000-0000-000000000404', 'Inès Rousseau', 'student', 'B1', 7, NOW() - INTERVAL '3 months', NOW()),
('00000000-0000-0000-0000-000000000405', 'Ethan Vincent', 'student', 'B1', 5, NOW() - INTERVAL '2 months', NOW())
ON CONFLICT (id) DO NOTHING;

-- Étudiants (niveau B2)
INSERT INTO profiles (id, name, role, level, tokens, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000501', 'Lina Chevalier', 'student', 'B2', 10, NOW() - INTERVAL '5 months', NOW()),
('00000000-0000-0000-0000-000000000502', 'Sacha Perrin', 'student', 'B2', 8, NOW() - INTERVAL '4 months', NOW()),
('00000000-0000-0000-0000-000000000503', 'Zoé Gautier', 'student', 'B2', 6, NOW() - INTERVAL '3 months', NOW()),
('00000000-0000-0000-0000-000000000504', 'Nathan Moulin', 'student', 'B2', 7, NOW() - INTERVAL '2 months', NOW())
ON CONFLICT (id) DO NOTHING;

-- Étudiants (niveau C1)
INSERT INTO profiles (id, name, role, level, tokens, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000601', 'Maël Dumas', 'student', 'C1', 12, NOW() - INTERVAL '4 months', NOW()),
('00000000-0000-0000-0000-000000000602', 'Juliette Rivière', 'student', 'C1', 9, NOW() - INTERVAL '3 months', NOW()),
('00000000-0000-0000-0000-000000000603', 'Théo Lemoine', 'student', 'C1', 11, NOW() - INTERVAL '2 months', NOW())
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- 2. DONNÉES POUR LES CATÉGORIES DE COURS
-- ========================================================

INSERT INTO course_categories (id, name, description, icon, color, created_at) VALUES
(1, 'Business English', 'Anglais professionnel pour le monde des affaires', '💼', 'blue', NOW() - INTERVAL '6 months'),
(2, 'Travel English', 'Anglais pratique pour voyager', '✈️', 'green', NOW() - INTERVAL '6 months'),
(3, 'Daily Conversation', 'Conversation quotidienne et pratique', '💬', 'purple', NOW() - INTERVAL '6 months'),
(4, 'Grammar Focus', 'Focus sur la grammaire et la structure', '📚', 'orange', NOW() - INTERVAL '6 months'),
(5, 'Exam Preparation', 'Préparation aux examens (TOEFL, IELTS)', '🎯', 'red', NOW() - INTERVAL '6 months'),
(6, 'Business Writing', 'Rédaction professionnelle en anglais', '✍️', 'indigo', NOW() - INTERVAL '6 months'),
(7, 'Pronunciation', 'Amélioration de la prononciation et de l''accent', '🔊', 'teal', NOW() - INTERVAL '6 months'),
(8, 'Cultural Studies', 'Études culturelles des pays anglophones', '🌍', 'pink', NOW() - INTERVAL '6 months'),
(9, 'Literature', 'Littérature anglophone', '📖', 'brown', NOW() - INTERVAL '6 months'),
(10, 'Technical English', 'Anglais technique et spécialisé', '🔧', 'gray', NOW() - INTERVAL '6 months')
ON CONFLICT DO NOTHING;

-- ========================================================
-- 3. DONNÉES POUR LES TYPES DE COURS
-- ========================================================

INSERT INTO course_types (id, name, description, route, icon, "order", created_at, updated_at) VALUES
(1, 'Cours collectifs', 'Groupes de 5 personnes max', '/courses', '📚', 1, NOW() - INTERVAL '6 months', NOW()),
(2, 'Ateliers grammaire', 'Par niveau (A1→B2+)', '/grammar-workshops', '✏️', 2, NOW() - INTERVAL '6 months', NOW()),
(3, 'Club conversation', 'Actualité & culture', '/conversation-club', '💬', 3, NOW() - INTERVAL '6 months', NOW()),
(4, 'Prononciation', 'Perfectionnez votre accent', '/pronunciation', '🔊', 4, NOW() - INTERVAL '6 months', NOW()),
(5, 'Cours particuliers', 'Cours individuels personnalisés', '/private-lessons', '👨‍🏫', 5, NOW() - INTERVAL '6 months', NOW()),
(6, 'Préparation examens', 'TOEFL, IELTS, Cambridge', '/exam-prep', '🎯', 6, NOW() - INTERVAL '6 months', NOW())
ON CONFLICT (id) DO NOTHING;
-- ========================================================
-- 4. DONNÉES POUR LES SESSIONS
-- ========================================================

-- Sessions passées (pour l'historique)
INSERT INTO sessions (name, description, category_id, teacher_id, "type", level, date_time, duration, max_students, price_tokens, meeting_link, status, created_at) VALUES
-- Sessions passées il y a 2 mois
('Past Tenses Review', 'Révision complète des temps du passé', 4, '00000000-0000-0000-0000-000000000101', 'grammar', 'A2', NOW() - INTERVAL '2 months', 60, 6, 1, 'https://meet.google.com/abc-defg-hij', 'completed', NOW() - INTERVAL '3 months'),
('Job Interview Skills', 'Préparez-vous aux entretiens en anglais', 1, '00000000-0000-0000-0000-000000000102', 'course', 'B2', NOW() - INTERVAL '2 months', 60, 4, 1, 'https://meet.google.com/klm-nop-qrs', 'completed', NOW() - INTERVAL '3 months'),
('Travel Vocabulary', 'Vocabulaire essentiel pour voyager', 2, '00000000-0000-0000-0000-000000000103', 'course', 'A1', NOW() - INTERVAL '2 months', 60, 5, 1, 'https://meet.google.com/tuv-wxy-zab', 'completed', NOW() - INTERVAL '3 months'),

-- Sessions passées il y a 1 mois
('Present Perfect Practice', 'Exercices sur le present perfect', 4, '00000000-0000-0000-0000-000000000101', 'grammar', 'B1', NOW() - INTERVAL '1 month', 60, 6, 1, 'https://meet.google.com/cde-fgh-ijk', 'completed', NOW() - INTERVAL '2 months'),
('Business Emails', 'Rédaction d''emails professionnels', 6, '00000000-0000-0000-0000-000000000102', 'course', 'B1', NOW() - INTERVAL '1 month', 60, 5, 1, 'https://meet.google.com/lmn-opq-rst', 'completed', NOW() - INTERVAL '2 months'),
('American Culture', 'Découverte de la culture américaine', 8, '00000000-0000-0000-0000-000000000103', 'conversation', 'B2', NOW() - INTERVAL '1 month', 60, 4, 1, 'https://meet.google.com/uvw-xyz-abc', 'completed', NOW() - INTERVAL '2 months'),
('Pronunciation Basics', 'Les bases de la prononciation anglaise', 7, '00000000-0000-0000-0000-000000000104', 'course', 'A1', NOW() - INTERVAL '1 month', 60, 5, 1, 'https://meet.google.com/def-ghi-jkl', 'completed', NOW() - INTERVAL '2 months'),

-- Sessions passées il y a 2 semaines
('Conditional Sentences', 'Maîtriser les phrases conditionnelles', 4, '00000000-0000-0000-0000-000000000101', 'grammar', 'B2', NOW() - INTERVAL '2 weeks', 60, 6, 1, 'https://meet.google.com/mno-pqr-stu', 'completed', NOW() - INTERVAL '1 month'),
('Presentation Skills', 'Techniques pour des présentations efficaces', 1, '00000000-0000-0000-0000-000000000102', 'course', 'C1', NOW() - INTERVAL '2 weeks', 60, 4, 1, 'https://meet.google.com/vwx-yza-bcd', 'completed', NOW() - INTERVAL '1 month'),
('Daily Routines', 'Vocabulaire des activités quotidiennes', 3, '00000000-0000-0000-0000-000000000103', 'conversation', 'A1', NOW() - INTERVAL '2 weeks', 60, 5, 1, 'https://meet.google.com/efg-hij-klm', 'completed', NOW() - INTERVAL '1 month'),

-- Sessions passées il y a 1 semaine
('Modal Verbs Workshop', 'Atelier sur les verbes modaux', 4, '00000000-0000-0000-0000-000000000101', 'grammar', 'A2', NOW() - INTERVAL '1 week', 60, 6, 1, 'https://meet.google.com/nop-qrs-tuv', 'completed', NOW() - INTERVAL '2 weeks'),
('Negotiation Techniques', 'Techniques de négociation en anglais', 1, '00000000-0000-0000-0000-000000000102', 'course', 'B2', NOW() - INTERVAL '1 week', 60, 4, 1, 'https://meet.google.com/wxy-zab-cde', 'completed', NOW() - INTERVAL '2 weeks'),
('British vs American English', 'Différences entre l''anglais britannique et américain', 8, '00000000-0000-0000-0000-000000000103', 'conversation', 'B1', NOW() - INTERVAL '1 week', 60, 5, 1, 'https://meet.google.com/fgh-ijk-lmn', 'completed', NOW() - INTERVAL '2 weeks'),
('Vowel Sounds', 'Maîtriser les sons des voyelles anglaises', 7, '00000000-0000-0000-0000-000000000104', 'course', 'A2', NOW() - INTERVAL '1 week', 60, 5, 1, 'https://meet.google.com/opq-rst-uvw', 'completed', NOW() - INTERVAL '2 weeks');

-- Sessions à venir (pour les réservations)
INSERT INTO sessions (name, description, category_id, teacher_id, "type", level, date_time, duration, max_students, price_tokens, meeting_link, status, created_at) VALUES
-- Sessions cette semaine
('Present Continuous', 'Utilisation du present continuous', 4, '00000000-0000-0000-0000-000000000101', 'grammar', 'A1', NOW() + INTERVAL '2 days', 60, 6, 1, 'https://meet.google.com/xyz-abc-def', 'scheduled', NOW() - INTERVAL '1 week'),
('Meeting Vocabulary', 'Vocabulaire essentiel pour les réunions', 1, '00000000-0000-0000-0000-000000000102', 'course', 'B1', NOW() + INTERVAL '3 days', 60, 4, 1, 'https://meet.google.com/ghi-jkl-mno', 'scheduled', NOW() - INTERVAL '1 week'),
('Travel Conversations', 'Conversations pratiques pour voyager', 2, '00000000-0000-0000-0000-000000000103', 'conversation', 'A2', NOW() + INTERVAL '4 days', 60, 5, 1, 'https://meet.google.com/pqr-stu-vwx', 'scheduled', NOW() - INTERVAL '1 week'),
('Consonant Sounds', 'Maîtriser les sons des consonnes anglaises', 7, '00000000-0000-0000-0000-000000000104', 'course', 'A1', NOW() + INTERVAL '5 days', 60, 5, 1, 'https://meet.google.com/yza-bcd-efg', 'scheduled', NOW() - INTERVAL '1 week'),

-- Sessions la semaine prochaine
('Past Simple vs Present Perfect', 'Différences entre past simple et present perfect', 4, '00000000-0000-0000-0000-000000000101', 'grammar', 'B1', NOW() + INTERVAL '1 week 1 day', 60, 6, 1, 'https://meet.google.com/hij-klm-nop', 'scheduled', NOW() - INTERVAL '2 weeks'),
('Email Writing Workshop', 'Atelier d''écriture d''emails professionnels', 6, '00000000-0000-0000-0000-000000000102', 'course', 'B2', NOW() + INTERVAL '1 week 2 days', 60, 4, 1, 'https://meet.google.com/qrs-tuv-wxy', 'scheduled', NOW() - INTERVAL '2 weeks'),
('Small Talk Practice', 'Pratique de la conversation informelle', 3, '00000000-0000-0000-0000-000000000103', 'conversation', 'A1', NOW() + INTERVAL '1 week 3 days', 60, 5, 1, 'https://meet.google.com/zab-cde-fgh', 'scheduled', NOW() - INTERVAL '2 weeks'),
('Stress and Intonation', 'Accentuation et intonation en anglais', 7, '00000000-0000-0000-0000-000000000104', 'course', 'B1', NOW() + INTERVAL '1 week 4 days', 60, 5, 1, 'https://meet.google.com/ijk-lmn-opq', 'scheduled', NOW() - INTERVAL '2 weeks'),
('IELTS Speaking Prep', 'Préparation à l''oral IELTS', 5, '00000000-0000-0000-0000-000000000105', 'course', 'C1', NOW() + INTERVAL '1 week 5 days', 90, 3, 2, 'https://meet.google.com/rst-uvw-xyz', 'scheduled', NOW() - INTERVAL '2 weeks'),

-- Sessions dans deux semaines
('Future Tenses', 'Les différentes façons d''exprimer le futur', 4, '00000000-0000-0000-0000-000000000101', 'grammar', 'A2', NOW() + INTERVAL '2 weeks 1 day', 60, 6, 1, 'https://meet.google.com/abc-def-ghi', 'scheduled', NOW() - INTERVAL '3 weeks'),
('Presentation Workshop', 'Atelier de présentation professionnelle', 1, '00000000-0000-0000-0000-000000000102', 'course', 'B2', NOW() + INTERVAL '2 weeks 2 days', 60, 4, 1, 'https://meet.google.com/jkl-mno-pqr', 'scheduled', NOW() - INTERVAL '3 weeks'),
('Current Events Discussion', 'Discussion sur l''actualité', 3, '00000000-0000-0000-0000-000000000103', 'conversation', 'B1', NOW() + INTERVAL '2 weeks 3 days', 60, 5, 1, 'https://meet.google.com/stu-vwx-yza', 'scheduled', NOW() - INTERVAL '3 weeks'),
('Difficult Sounds', 'Maîtriser les sons difficiles en anglais', 7, '00000000-0000-0000-0000-000000000104', 'course', 'B2', NOW() + INTERVAL '2 weeks 4 days', 60, 5, 1, 'https://meet.google.com/bcd-efg-hij', 'scheduled', NOW() - INTERVAL '3 weeks'),
('TOEFL Preparation', 'Préparation complète au TOEFL', 5, '00000000-0000-0000-0000-000000000105', 'course', 'C1', NOW() + INTERVAL '2 weeks 5 days', 90, 3, 2, 'https://meet.google.com/klm-nop-qrs', 'scheduled', NOW() - INTERVAL '3 weeks'),

-- Sessions dans trois semaines
('Passive Voice', 'Maîtriser la voix passive', 4, '00000000-0000-0000-0000-000000000101', 'grammar', 'B1', NOW() + INTERVAL '3 weeks 1 day', 60, 6, 1, 'https://meet.google.com/tuv-wxy-zab', 'scheduled', NOW() - INTERVAL '4 weeks'),
('Business Negotiations', 'Techniques de négociation commerciale', 1, '00000000-0000-0000-0000-000000000102', 'course', 'C1', NOW() + INTERVAL '3 weeks 2 days', 60, 4, 1, 'https://meet.google.com/cde-fgh-ijk', 'scheduled', NOW() - INTERVAL '4 weeks'),
('British Culture', 'Découverte de la culture britannique', 8, '00000000-0000-0000-0000-000000000103', 'conversation', 'B2', NOW() + INTERVAL '3 weeks 3 days', 60, 5, 1, 'https://meet.google.com/lmn-opq-rst', 'scheduled', NOW() - INTERVAL '4 weeks'),
('Connected Speech', 'Fluidité et enchaînement des mots', 7, '00000000-0000-0000-0000-000000000104', 'course', 'C1', NOW() + INTERVAL '3 weeks 4 days', 60, 5, 1, 'https://meet.google.com/uvw-xyz-abc', 'scheduled', NOW() - INTERVAL '4 weeks'),
('Cambridge Exam Prep', 'Préparation aux examens Cambridge', 5, '00000000-0000-0000-0000-000000000105', 'course', 'B2', NOW() + INTERVAL '3 weeks 5 days', 90, 3, 2, 'https://meet.google.com/def-ghi-jkl', 'scheduled', NOW() - INTERVAL '4 weeks');
-- ========================================================
-- 5. DONNÉES POUR LES RÉSERVATIONS
-- ========================================================

-- Réservations pour les sessions passées
INSERT INTO bookings (session_id, student_id, status, booked_at) VALUES
-- Réservations pour les sessions il y a 2 mois
(1, '00000000-0000-0000-0000-000000000301', 'attended', NOW() - INTERVAL '2 months 1 week'),
(1, '00000000-0000-0000-0000-000000000302', 'attended', NOW() - INTERVAL '2 months 1 week'),
(1, '00000000-0000-0000-0000-000000000303', 'attended', NOW() - INTERVAL '2 months 1 week'),
(1, '00000000-0000-0000-0000-000000000304', 'cancelled', NOW() - INTERVAL '2 months 1 week'),
(2, '00000000-0000-0000-0000-000000000501', 'attended', NOW() - INTERVAL '2 months 1 week'),
(2, '00000000-0000-0000-0000-000000000502', 'attended', NOW() - INTERVAL '2 months 1 week'),
(2, '00000000-0000-0000-0000-000000000503', 'cancelled', NOW() - INTERVAL '2 months 1 week'),
(3, '00000000-0000-0000-0000-000000000201', 'attended', NOW() - INTERVAL '2 months 1 week'),
(3, '00000000-0000-0000-0000-000000000202', 'attended', NOW() - INTERVAL '2 months 1 week'),
(3, '00000000-0000-0000-0000-000000000203', 'attended', NOW() - INTERVAL '2 months 1 week'),
(3, '00000000-0000-0000-0000-000000000204', 'attended', NOW() - INTERVAL '2 months 1 week'),

-- Réservations pour les sessions il y a 1 mois
(4, '00000000-0000-0000-0000-000000000401', 'attended', NOW() - INTERVAL '1 month 1 week'),
(4, '00000000-0000-0000-0000-000000000402', 'attended', NOW() - INTERVAL '1 month 1 week'),
(4, '00000000-0000-0000-0000-000000000403', 'attended', NOW() - INTERVAL '1 month 1 week'),
(4, '00000000-0000-0000-0000-000000000404', 'cancelled', NOW() - INTERVAL '1 month 1 week'),
(5, '00000000-0000-0000-0000-000000000401', 'attended', NOW() - INTERVAL '1 month 1 week'),
(5, '00000000-0000-0000-0000-000000000402', 'attended', NOW() - INTERVAL '1 month 1 week'),
(5, '00000000-0000-0000-0000-000000000403', 'attended', NOW() - INTERVAL '1 month 1 week'),
(6, '00000000-0000-0000-0000-000000000501', 'attended', NOW() - INTERVAL '1 month 1 week'),
(6, '00000000-0000-0000-0000-000000000502', 'attended', NOW() - INTERVAL '1 month 1 week'),
(6, '00000000-0000-0000-0000-000000000503', 'cancelled', NOW() - INTERVAL '1 month 1 week'),
(7, '00000000-0000-0000-0000-000000000201', 'attended', NOW() - INTERVAL '1 month 1 week'),
(7, '00000000-0000-0000-0000-000000000202', 'attended', NOW() - INTERVAL '1 month 1 week'),
(7, '00000000-0000-0000-0000-000000000203', 'attended', NOW() - INTERVAL '1 month 1 week'),

-- Réservations pour les sessions il y a 2 semaines
(8, '00000000-0000-0000-0000-000000000501', 'attended', NOW() - INTERVAL '2 weeks 3 days'),
(8, '00000000-0000-0000-0000-000000000502', 'attended', NOW() - INTERVAL '2 weeks 3 days'),
(8, '00000000-0000-0000-0000-000000000503', 'attended', NOW() - INTERVAL '2 weeks 3 days'),
(8, '00000000-0000-0000-0000-000000000504', 'attended', NOW() - INTERVAL '2 weeks 3 days'),
(9, '00000000-0000-0000-0000-000000000601', 'attended', NOW() - INTERVAL '2 weeks 3 days'),
(9, '00000000-0000-0000-0000-000000000602', 'attended', NOW() - INTERVAL '2 weeks 3 days'),
(9, '00000000-0000-0000-0000-000000000603', 'attended', NOW() - INTERVAL '2 weeks 3 days'),
(10, '00000000-0000-0000-0000-000000000201', 'attended', NOW() - INTERVAL '2 weeks 3 days'),
(10, '00000000-0000-0000-0000-000000000202', 'attended', NOW() - INTERVAL '2 weeks 3 days'),
(10, '00000000-0000-0000-0000-000000000203', 'attended', NOW() - INTERVAL '2 weeks 3 days'),

-- Réservations pour les sessions il y a 1 semaine
(11, '00000000-0000-0000-0000-000000000301', 'attended', NOW() - INTERVAL '1 week 3 days'),
(11, '00000000-0000-0000-0000-000000000302', 'attended', NOW() - INTERVAL '1 week 3 days'),
(11, '00000000-0000-0000-0000-000000000303', 'attended', NOW() - INTERVAL '1 week 3 days'),
(11, '00000000-0000-0000-0000-000000000304', 'attended', NOW() - INTERVAL '1 week 3 days'),
(12, '00000000-0000-0000-0000-000000000501', 'attended', NOW() - INTERVAL '1 week 3 days'),
(12, '00000000-0000-0000-0000-000000000502', 'attended', NOW() - INTERVAL '1 week 3 days'),
(12, '00000000-0000-0000-0000-000000000503', 'attended', NOW() - INTERVAL '1 week 3 days'),
(13, '00000000-0000-0000-0000-000000000401', 'attended', NOW() - INTERVAL '1 week 3 days'),
(13, '00000000-0000-0000-0000-000000000402', 'attended', NOW() - INTERVAL '1 week 3 days'),
(13, '00000000-0000-0000-0000-000000000403', 'attended', NOW() - INTERVAL '1 week 3 days'),
(14, '00000000-0000-0000-0000-000000000301', 'attended', NOW() - INTERVAL '1 week 3 days'),
(14, '00000000-0000-0000-0000-000000000302', 'attended', NOW() - INTERVAL '1 week 3 days'),
(14, '00000000-0000-0000-0000-000000000303', 'attended', NOW() - INTERVAL '1 week 3 days');

-- Réservations pour les sessions à venir
INSERT INTO bookings (session_id, student_id, status, booked_at) VALUES
-- Réservations pour les sessions cette semaine
(15, '00000000-0000-0000-0000-000000000201', 'confirmed', NOW() - INTERVAL '5 days'),
(15, '00000000-0000-0000-0000-000000000202', 'confirmed', NOW() - INTERVAL '4 days'),
(15, '00000000-0000-0000-0000-000000000203', 'confirmed', NOW() - INTERVAL '3 days'),
(16, '00000000-0000-0000-0000-000000000401', 'confirmed', NOW() - INTERVAL '6 days'),
(16, '00000000-0000-0000-0000-000000000402', 'confirmed', NOW() - INTERVAL '5 days'),
(17, '00000000-0000-0000-0000-000000000301', 'confirmed', NOW() - INTERVAL '4 days'),
(17, '00000000-0000-0000-0000-000000000302', 'confirmed', NOW() - INTERVAL '3 days'),
(18, '00000000-0000-0000-0000-000000000201', 'confirmed', NOW() - INTERVAL '5 days'),
(18, '00000000-0000-0000-0000-000000000202', 'confirmed', NOW() - INTERVAL '4 days'),

-- Réservations pour les sessions la semaine prochaine
(19, '00000000-0000-0000-0000-000000000401', 'confirmed', NOW() - INTERVAL '10 days'),
(19, '00000000-0000-0000-0000-000000000402', 'confirmed', NOW() - INTERVAL '9 days'),
(20, '00000000-0000-0000-0000-000000000501', 'confirmed', NOW() - INTERVAL '8 days'),
(20, '00000000-0000-0000-0000-000000000502', 'confirmed', NOW() - INTERVAL '7 days'),
(21, '00000000-0000-0000-0000-000000000201', 'confirmed', NOW() - INTERVAL '6 days'),
(21, '00000000-0000-0000-0000-000000000202', 'confirmed', NOW() - INTERVAL '5 days'),
(22, '00000000-0000-0000-0000-000000000401', 'confirmed', NOW() - INTERVAL '7 days'),
(22, '00000000-0000-0000-0000-000000000402', 'confirmed', NOW() - INTERVAL '6 days'),
(23, '00000000-0000-0000-0000-000000000601', 'confirmed', NOW() - INTERVAL '12 days'),
(23, '00000000-0000-0000-0000-000000000602', 'confirmed', NOW() - INTERVAL '11 days');
-- ========================================================
-- 6. DONNÉES POUR LES RESSOURCES PÉDAGOGIQUES
-- ========================================================

INSERT INTO resources (session_id, name, "type", url, size, uploaded_by, created_at) VALUES
-- Ressources pour les sessions passées
(1, 'Past Tenses Guide', 'pdf', '/resources/past-tenses-guide.pdf', 2048, '00000000-0000-0000-0000-000000000101', NOW() - INTERVAL '2 months 2 weeks'),
(1, 'Past Tenses Exercises', 'pdf', '/resources/past-tenses-exercises.pdf', 1536, '00000000-0000-0000-0000-000000000101', NOW() - INTERVAL '2 months 2 weeks'),
(2, 'Job Interview Questions', 'pdf', '/resources/job-interview-questions.pdf', 1024, '00000000-0000-0000-0000-000000000102', NOW() - INTERVAL '2 months 2 weeks'),
(2, 'Interview Vocabulary Audio', 'audio', '/resources/interview-vocabulary.mp3', 5120, '00000000-0000-0000-0000-000000000102', NOW() - INTERVAL '2 months 2 weeks'),
(3, 'Travel Phrases PDF', 'pdf', '/resources/travel-phrases.pdf', 1280, '00000000-0000-0000-0000-000000000103', NOW() - INTERVAL '2 months 2 weeks'),
(3, 'Travel Dialogue Video', 'video', '/resources/travel-dialogue.mp4', 10240, '00000000-0000-0000-0000-000000000103', NOW() - INTERVAL '2 months 2 weeks'),
(4, 'Present Perfect Guide', 'pdf', '/resources/present-perfect-guide.pdf', 1792, '00000000-0000-0000-0000-000000000101', NOW() - INTERVAL '1 month 2 weeks'),
(4, 'Present Perfect Exercises', 'pdf', '/resources/present-perfect-exercises.pdf', 1536, '00000000-0000-0000-0000-000000000101', NOW() - INTERVAL '1 month 2 weeks'),
(5, 'Business Email Templates', 'pdf', '/resources/business-email-templates.pdf', 1024, '00000000-0000-0000-0000-000000000102', NOW() - INTERVAL '1 month 2 weeks'),
(5, 'Email Writing Tips', 'pdf', '/resources/email-writing-tips.pdf', 896, '00000000-0000-0000-0000-000000000102', NOW() - INTERVAL '1 month 2 weeks'),
(6, 'American Culture Slides', 'pdf', '/resources/american-culture-slides.pdf', 3072, '00000000-0000-0000-0000-000000000103', NOW() - INTERVAL '1 month 2 weeks'),
(6, 'American Slang Guide', 'pdf', '/resources/american-slang-guide.pdf', 1280, '00000000-0000-0000-0000-000000000103', NOW() - INTERVAL '1 month 2 weeks'),
(7, 'Pronunciation Basics PDF', 'pdf', '/resources/pronunciation-basics.pdf', 1536, '00000000-0000-0000-0000-000000000104', NOW() - INTERVAL '1 month 2 weeks'),
(7, 'Pronunciation Audio Exercises', 'audio', '/resources/pronunciation-exercises.mp3', 8192, '00000000-0000-0000-0000-000000000104', NOW() - INTERVAL '1 month 2 weeks'),

-- Ressources pour les sessions à venir
(15, 'Present Continuous Guide', 'pdf', '/resources/present-continuous-guide.pdf', 1792, '00000000-0000-0000-0000-000000000101', NOW() - INTERVAL '1 week'),
(15, 'Present Continuous Exercises', 'pdf', '/resources/present-continuous-exercises.pdf', 1536, '00000000-0000-0000-0000-000000000101', NOW() - INTERVAL '1 week'),
(16, 'Meeting Vocabulary List', 'pdf', '/resources/meeting-vocabulary.pdf', 1024, '00000000-0000-0000-0000-000000000102', NOW() - INTERVAL '1 week'),
(16, 'Meeting Phrases Audio', 'audio', '/resources/meeting-phrases.mp3', 4096, '00000000-0000-0000-0000-000000000102', NOW() - INTERVAL '1 week'),
(17, 'Travel Conversation Guide', 'pdf', '/resources/travel-conversation-guide.pdf', 1280, '00000000-0000-0000-0000-000000000103', NOW() - INTERVAL '1 week'),
(17, 'Travel Situations Video', 'video', '/resources/travel-situations.mp4', 12288, '00000000-0000-0000-0000-000000000103', NOW() - INTERVAL '1 week'),
(18, 'Consonant Sounds Guide', 'pdf', '/resources/consonant-sounds-guide.pdf', 1536, '00000000-0000-0000-0000-000000000104', NOW() - INTERVAL '1 week'),
(18, 'Consonant Practice Audio', 'audio', '/resources/consonant-practice.mp3', 7168, '00000000-0000-0000-0000-000000000104', NOW() - INTERVAL '1 week'),
(19, 'Past vs Present Perfect Guide', 'pdf', '/resources/past-vs-present-perfect.pdf', 2048, '00000000-0000-0000-0000-000000000101', NOW() - INTERVAL '2 weeks'),
(20, 'Email Templates Collection', 'pdf', '/resources/email-templates-collection.pdf', 1536, '00000000-0000-0000-0000-000000000102', NOW() - INTERVAL '2 weeks'),
(21, 'Small Talk Topics', 'pdf', '/resources/small-talk-topics.pdf', 1024, '00000000-0000-0000-0000-000000000103', NOW() - INTERVAL '2 weeks'),
(22, 'Stress and Intonation Guide', 'pdf', '/resources/stress-intonation-guide.pdf', 1792, '00000000-0000-0000-0000-000000000104', NOW() - INTERVAL '2 weeks'),
(23, 'IELTS Speaking Guide', 'pdf', '/resources/ielts-speaking-guide.pdf', 3072, '00000000-0000-0000-0000-000000000105', NOW() - INTERVAL '2 weeks'),
(23, 'IELTS Practice Questions', 'pdf', '/resources/ielts-practice-questions.pdf', 2048, '00000000-0000-0000-0000-000000000105', NOW() - INTERVAL '2 weeks'),
(23, 'IELTS Speaking Examples', 'audio', '/resources/ielts-speaking-examples.mp3', 10240, '00000000-0000-0000-0000-000000000105', NOW() - INTERVAL '2 weeks');

-- ========================================================
-- 7. DONNÉES POUR LES ÉVALUATIONS
-- ========================================================

INSERT INTO evaluations (name, description, "type", level, duration_minutes, passing_score, prerequisite_grammar_completion, created_at) VALUES
('Test de niveau initial', 'Évaluez votre niveau d''anglais actuel', 'initial', NULL, 30, 0, 0, NOW() - INTERVAL '6 months'),
('Évaluation A1 → A2', 'Passez au niveau A2', 'level', 'A1', 45, 80, 80, NOW() - INTERVAL '6 months'),
('Évaluation A2 → B1', 'Passez au niveau B1', 'level', 'A2', 45, 80, 80, NOW() - INTERVAL '6 months'),
('Évaluation B1 → B2', 'Passez au niveau B2', 'level', 'B1', 60, 80, 80, NOW() - INTERVAL '6 months'),
('Évaluation B2 → C1', 'Passez au niveau C1', 'level', 'B2', 60, 80, 80, NOW() - INTERVAL '6 months'),
('Certification ELC Academy', 'Obtenez votre certificat final', 'final', 'C1', 90, 85, 100, NOW() - INTERVAL '6 months')
ON CONFLICT DO NOTHING;

-- ========================================================
-- 8. DONNÉES POUR LES QUESTIONS D'ÉVALUATION
-- ========================================================

-- Questions pour le test de niveau initial
INSERT INTO evaluation_questions (evaluation_id, question, options, correct_answer, order_index, created_at) 
SELECT 
  e.id,
  q.question,
  q.options::jsonb,
  q.correct_answer,
  q.order_index,
  NOW() - INTERVAL '6 months'
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
INSERT INTO evaluation_questions (evaluation_id, question, options, correct_answer, order_index, created_at) 
SELECT 
  e.id,
  q.question,
  q.options::jsonb,
  q.correct_answer,
  q.order_index,
  NOW() - INTERVAL '6 months'
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

-- Questions pour l'évaluation A2 → B1
INSERT INTO evaluation_questions (evaluation_id, question, options, correct_answer, order_index, created_at) 
SELECT 
  e.id,
  q.question,
  q.options::jsonb,
  q.correct_answer,
  q.order_index,
  NOW() - INTERVAL '6 months'
FROM evaluations e,
(VALUES
  ('If I ___ rich, I would travel the world.', '["am", "was", "were", "will be"]', 2, 1),
  ('By the time we arrived, the movie ___.', '["already started", "has already started", "had already started", "was already starting"]', 2, 2),
  ('She asked me what I ___ doing.', '["am", "was", "were", "had"]', 1, 3),
  ('I wish I ___ taller.', '["am", "was", "were", "will be"]', 2, 4),
  ('This is the best book I ___ read.', '["ever", "never", "have ever", "had ever"]', 2, 5)
) AS q(question, options, correct_answer, order_index)
WHERE e.name = 'Évaluation A2 → B1'
ON CONFLICT DO NOTHING;

-- ========================================================
-- 9. DONNÉES POUR LES RÉSULTATS D'ÉVALUATION
-- ========================================================

INSERT INTO user_evaluations (user_id, evaluation_id, score, passed, completed_at) VALUES
-- Résultats pour les étudiants A1
('00000000-0000-0000-0000-000000000201', 1, 45, true, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000202', 1, 40, true, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000203', 1, 42, true, NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000204', 1, 38, true, NOW() - INTERVAL '5 months'),

-- Résultats pour les étudiants A2 (ont passé A1→A2)
('00000000-0000-0000-0000-000000000301', 1, 62, true, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000301', 2, 85, true, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000302', 1, 58, true, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000302', 2, 82, true, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000303', 1, 60, true, NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000303', 2, 88, true, NOW() - INTERVAL '5 months'),

-- Résultats pour les étudiants B1 (ont passé A2→B1)
('00000000-0000-0000-0000-000000000401', 1, 75, true, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000401', 2, 90, true, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000401', 3, 84, true, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000402', 1, 72, true, NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000402', 2, 86, true, NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000402', 3, 81, true, NOW() - INTERVAL '5 months'),

-- Résultats pour les étudiants B2 (ont passé B1→B2)
('00000000-0000-0000-0000-000000000501', 1, 88, true, NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000501', 2, 92, true, NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000501', 3, 90, true, NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000501', 4, 85, true, NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000502', 1, 85, true, NOW() - INTERVAL '4 months'),
('00000000-0000-0000-0000-000000000502', 2, 88, true, NOW() - INTERVAL '4 months'),
('00000000-0000-0000-0000-000000000502', 3, 86, true, NOW() - INTERVAL '4 months'),
('00000000-0000-0000-0000-000000000502', 4, 83, true, NOW() - INTERVAL '4 months'),

-- Résultats pour les étudiants C1 (ont passé B2→C1)
('00000000-0000-0000-0000-000000000601', 1, 95, true, NOW() - INTERVAL '4 months'),
('00000000-0000-0000-0000-000000000601', 2, 96, true, NOW() - INTERVAL '4 months'),
('00000000-0000-0000-0000-000000000601', 3, 94, true, NOW() - INTERVAL '4 months'),
('00000000-0000-0000-0000-000000000601', 4, 92, true, NOW() - INTERVAL '4 months'),
('00000000-0000-0000-0000-000000000601', 5, 90, true, NOW() - INTERVAL '4 months'),
('00000000-0000-0000-0000-000000000602', 1, 92, true, NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000602', 2, 94, true, NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000602', 3, 91, true, NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000602', 4, 89, true, NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000602', 5, 87, true, NOW() - INTERVAL '3 months');
-- ========================================================
-- 10. DONNÉES POUR LES ABONNEMENTS
-- ========================================================

INSERT INTO subscriptions (user_id, plan, status, starts_at, expires_at, tokens_per_month, created_at) VALUES
-- Abonnements actifs
('00000000-0000-0000-0000-000000000201', '4months', 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '3 months', 4, NOW() - INTERVAL '1 month'),
('00000000-0000-0000-0000-000000000202', '6months', 'active', NOW() - INTERVAL '2 months', NOW() + INTERVAL '4 months', 4, NOW() - INTERVAL '2 months'),
('00000000-0000-0000-0000-000000000301', '6months', 'active', NOW() - INTERVAL '3 months', NOW() + INTERVAL '3 months', 4, NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000401', '4months', 'active', NOW() - INTERVAL '2 months', NOW() + INTERVAL '2 months', 4, NOW() - INTERVAL '2 months'),
('00000000-0000-0000-0000-000000000501', '6months', 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '5 months', 4, NOW() - INTERVAL '1 month'),
('00000000-0000-0000-0000-000000000601', '6months', 'active', NOW() - INTERVAL '2 months', NOW() + INTERVAL '4 months', 4, NOW() - INTERVAL '2 months'),

-- Abonnements expirés
('00000000-0000-0000-0000-000000000203', '4months', 'expired', NOW() - INTERVAL '5 months', NOW() - INTERVAL '1 month', 4, NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000302', '4months', 'expired', NOW() - INTERVAL '6 months', NOW() - INTERVAL '2 months', 4, NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000402', '6months', 'expired', NOW() - INTERVAL '7 months', NOW() - INTERVAL '1 month', 4, NOW() - INTERVAL '7 months'),

-- Abonnements annulés
('00000000-0000-0000-0000-000000000204', '4months', 'cancelled', NOW() - INTERVAL '3 months', NOW() - INTERVAL '1 month', 4, NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000303', '6months', 'cancelled', NOW() - INTERVAL '4 months', NOW() - INTERVAL '2 months', 4, NOW() - INTERVAL '4 months');

-- ========================================================
-- 11. DONNÉES POUR LES TRANSACTIONS
-- ========================================================

INSERT INTO transactions (user_id, amount, "type", description, booking_id, created_at, updated_at) VALUES
-- Paiements d'abonnements
('00000000-0000-0000-0000-000000000201', 120.00, 'subscription', 'Abonnement 4 mois', NULL, NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month'),
('00000000-0000-0000-0000-000000000202', 160.00, 'subscription', 'Abonnement 6 mois', NULL, NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months'),
('00000000-0000-0000-0000-000000000301', 160.00, 'subscription', 'Abonnement 6 mois', NULL, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000401', 120.00, 'subscription', 'Abonnement 4 mois', NULL, NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months'),
('00000000-0000-0000-0000-000000000501', 160.00, 'subscription', 'Abonnement 6 mois', NULL, NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month'),
('00000000-0000-0000-0000-000000000601', 160.00, 'subscription', 'Abonnement 6 mois', NULL, NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months'),
('00000000-0000-0000-0000-000000000203', 120.00, 'subscription', 'Abonnement 4 mois', NULL, NOW() - INTERVAL '5 months', NOW() - INTERVAL '5 months'),
('00000000-0000-0000-0000-000000000302', 120.00, 'subscription', 'Abonnement 4 mois', NULL, NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months'),
('00000000-0000-0000-0000-000000000402', 160.00, 'subscription', 'Abonnement 6 mois', NULL, NOW() - INTERVAL '7 months', NOW() - INTERVAL '7 months'),
('00000000-0000-0000-0000-000000000204', 120.00, 'subscription', 'Abonnement 4 mois', NULL, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000303', 160.00, 'subscription', 'Abonnement 6 mois', NULL, NOW() - INTERVAL '4 months', NOW() - INTERVAL '4 months'),

-- Paiements de cours particuliers
('00000000-0000-0000-0000-000000000201', 50.00, 'payment', 'Cours particulier avec Marie Dupont', 1, NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '3 weeks'),
('00000000-0000-0000-0000-000000000301', 50.00, 'payment', 'Cours particulier avec Jean Martin', 2, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks'),
('00000000-0000-0000-0000-000000000401', 50.00, 'payment', 'Cours particulier avec Sophie Leclerc', 3, NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
('00000000-0000-0000-0000-000000000501', 50.00, 'payment', 'Cours particulier avec Thomas Bernard', 4, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000601', 50.00, 'payment', 'Cours particulier avec Claire Dubois', 5, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Paiements de tokens supplémentaires
('00000000-0000-0000-0000-000000000202', 30.00, 'payment', 'Achat de 10 tokens supplémentaires', NULL, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks'),
('00000000-0000-0000-0000-000000000302', 15.00, 'payment', 'Achat de 5 tokens supplémentaires', NULL, NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
('00000000-0000-0000-0000-000000000402', 30.00, 'payment', 'Achat de 10 tokens supplémentaires', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- Remboursements
('00000000-0000-0000-0000-000000000204', 30.00, 'refund', 'Remboursement partiel abonnement annulé', NULL, NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 months'),
('00000000-0000-0000-0000-000000000303', 40.00, 'refund', 'Remboursement partiel abonnement annulé', NULL, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months');

-- ========================================================
-- 12. DONNÉES POUR LES TEMPLATES DE SESSION
-- ========================================================

INSERT INTO session_templates (id, name, description, category_id, duration, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Introduction à l''anglais des affaires', 'Bases de l''anglais professionnel', 1, 60, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000002', 'Present Perfect vs Past Simple', 'Maîtriser la différence entre ces deux temps', 4, 60, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000003', 'Conversation: Voyages et Cultures', 'Discussion sur les voyages et découvertes culturelles', 3, 60, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000004', 'Prononciation des sons difficiles', 'Maîtriser les sons spécifiques à l''anglais', 7, 60, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months'),
('00000000-0000-0000-0000-000000000005', 'Préparation IELTS Speaking', 'Techniques pour réussir la partie orale de l''IELTS', 5, 90, NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months');

-- ========================================================
-- FIN DU SCRIPT DE DONNÉES
-- ========================================================
-- Ce script a créé des données réalistes pour toutes les tables
-- de la base de données Supabase de l'application ELC Académie en ligne.
-- Les données sont cohérentes entre elles et permettent de tester
-- toutes les fonctionnalités de l'application.

-- Réactiver les contraintes de clé étrangère
SET session_replication_role = 'origin';