-- Fix quiz_questions RLS policies to prevent answer exposure
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON public.quiz_questions;

-- Only admins and pemateri can view quiz questions with answers
CREATE POLICY "Admin and pemateri can view questions"
ON public.quiz_questions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pemateri'::app_role));

-- Create secure RPC function to get quiz questions without answers for quiz takers
CREATE OR REPLACE FUNCTION public.get_quiz_questions_for_taking(p_quiz_id UUID)
RETURNS TABLE (
  id UUID,
  quiz_id UUID,
  question TEXT,
  options JSONB,
  points INTEGER,
  order_number INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    quiz_id,
    question,
    options,
    points,
    order_number
  FROM public.quiz_questions
  WHERE quiz_id = p_quiz_id
  ORDER BY order_number;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_quiz_questions_for_taking(UUID) TO authenticated;