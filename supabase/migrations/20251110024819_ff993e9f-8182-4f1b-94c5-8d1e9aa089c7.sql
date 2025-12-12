-- Function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_badge RECORD;
  v_quiz_count INTEGER;
  v_attendance_count INTEGER;
  v_max_quiz_score INTEGER;
  v_already_earned BOOLEAN;
BEGIN
  -- Get user stats
  SELECT COUNT(*) INTO v_quiz_count
  FROM quiz_attempts WHERE user_id = p_user_id;
  
  SELECT COUNT(*) INTO v_attendance_count
  FROM absensi WHERE user_id = p_user_id;
  
  SELECT COALESCE(MAX(score), 0) INTO v_max_quiz_score
  FROM quiz_attempts WHERE user_id = p_user_id;
  
  -- Check each badge
  FOR v_badge IN SELECT * FROM badges LOOP
    -- Check if already earned
    SELECT EXISTS(
      SELECT 1 FROM user_badges 
      WHERE user_id = p_user_id AND badge_id = v_badge.id
    ) INTO v_already_earned;
    
    -- Skip if already earned
    CONTINUE WHEN v_already_earned;
    
    -- Check requirements and award badge
    IF (v_badge.requirement_type = 'quiz_count' AND v_quiz_count >= v_badge.requirement_value) OR
       (v_badge.requirement_type = 'attendance_count' AND v_attendance_count >= v_badge.requirement_value) OR
       (v_badge.requirement_type = 'quiz_score' AND v_max_quiz_score >= v_badge.requirement_value) THEN
      
      -- Award badge
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id);
      
      -- Send notification
      INSERT INTO notifications (user_id, type, title, message, reference_id)
      VALUES (
        p_user_id,
        'badge',
        'Badge Baru! 🏆',
        'Selamat! Kamu mendapatkan badge "' || v_badge.name || '" dengan ' || v_badge.points || ' poin!',
        v_badge.id
      );
    END IF;
  END LOOP;
END;
$$;

-- Trigger function for quiz attempts
CREATE OR REPLACE FUNCTION public.trigger_check_badges_quiz()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.check_and_award_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

-- Trigger function for absensi
CREATE OR REPLACE FUNCTION public.trigger_check_badges_absensi()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.check_and_award_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS check_badges_after_quiz ON quiz_attempts;
CREATE TRIGGER check_badges_after_quiz
  AFTER INSERT ON quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_check_badges_quiz();

DROP TRIGGER IF EXISTS check_badges_after_absensi ON absensi;
CREATE TRIGGER check_badges_after_absensi
  AFTER INSERT ON absensi
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_check_badges_absensi();

-- Trigger function for new quiz notifications
CREATE OR REPLACE FUNCTION public.notify_new_quiz()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Send notification to all users
  INSERT INTO notifications (user_id, type, title, message, reference_id)
  SELECT 
    ur.user_id,
    'quiz',
    'Quiz Baru! 📝',
    'Quiz baru "' || NEW.title || '" telah tersedia. Yuk ikutan!',
    NEW.id
  FROM user_roles ur
  WHERE ur.role = 'user';
  
  RETURN NEW;
END;
$$;

-- Trigger function for new jadwal notifications
CREATE OR REPLACE FUNCTION public.notify_new_jadwal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Send notification to all users
  INSERT INTO notifications (user_id, type, title, message, reference_id)
  SELECT 
    ur.user_id,
    'kajian',
    'Kajian Baru! 📅',
    'Kajian "' || NEW.title || '" telah dijadwalkan pada ' || to_char(NEW.date, 'DD Mon YYYY HH24:MI'),
    NEW.id
  FROM user_roles ur
  WHERE ur.role = 'user';
  
  RETURN NEW;
END;
$$;

-- Create triggers for notifications
DROP TRIGGER IF EXISTS notify_quiz_created ON quiz;
CREATE TRIGGER notify_quiz_created
  AFTER INSERT ON quiz
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION public.notify_new_quiz();

DROP TRIGGER IF EXISTS notify_jadwal_created ON jadwal_kajian;
CREATE TRIGGER notify_jadwal_created
  AFTER INSERT ON jadwal_kajian
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_jadwal();