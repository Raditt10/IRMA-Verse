import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: any;
  correct_answer: string;
  points: number;
  order_number: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
}

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining, quizCompleted]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchQuiz = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from("quiz")
        .select("*")
        .eq("id", id)
        .single();

      if (quizError) throw quizError;
      setQuiz(quizData);

      // Use secure RPC function to get questions without correct answers
      const { data: questionsData, error: questionsError } = await supabase
        .rpc("get_quiz_questions_for_taking", { p_quiz_id: id });

      if (questionsError) throw questionsError;
      
      // Parse options if needed
      const parsedQuestions = questionsData.map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correct_answer: "" // Answer not exposed during quiz taking
      }));
      setQuestions(parsedQuestions);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    if (quiz) {
      setTimeRemaining(quiz.duration_minutes * 60);
      setQuizStarted(true);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let correctAnswers = 0;
    let earnedPoints = 0;
    let maxPoints = 0;

    questions.forEach((q) => {
      maxPoints += q.points;
      if (answers[q.id] === q.correct_answer) {
        correctAnswers++;
        earnedPoints += q.points;
      }
    });

    const scorePercentage = Math.round((earnedPoints / maxPoints) * 100);

    try {
      await supabase.from("quiz_attempts").insert({
        quiz_id: quiz.id,
        user_id: session.user.id,
        score: scorePercentage,
        total_points: earnedPoints,
        answers: answers,
        started_at: new Date(Date.now() - (quiz.duration_minutes * 60 - timeRemaining) * 1000).toISOString(),
      });

      setScore(scorePercentage);
      setTotalPoints(earnedPoints);
      setQuizCompleted(true);

      toast({
        title: scorePercentage >= quiz.passing_score ? "Selamat! Anda Lulus" : "Quiz Selesai",
        description: `Skor Anda: ${scorePercentage}% (${earnedPoints}/${maxPoints} poin)`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <p className="text-center text-muted-foreground">Memuat quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <p className="text-center text-muted-foreground">Quiz tidak ditemukan</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <Card className="text-center">
            <CardHeader>
              <CheckCircle2 className={`h-16 w-16 mx-auto mb-4 ${score >= quiz.passing_score ? 'text-green-500' : 'text-yellow-500'}`} />
              <CardTitle className="text-2xl">
                {score >= quiz.passing_score ? 'Selamat! Anda Lulus!' : 'Quiz Selesai'}
              </CardTitle>
              <CardDescription>Hasil Quiz Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-4xl font-bold text-primary">{score}%</p>
                <p className="text-muted-foreground">Skor Anda</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{totalPoints} poin</p>
                <p className="text-muted-foreground">Total Poin yang Diperoleh</p>
              </div>
              <div className="pt-4 space-x-2">
                <Button onClick={() => navigate("/quiz")}>Kembali ke Daftar Quiz</Button>
                <Button variant="outline" onClick={() => navigate("/leaderboard")}>Lihat Leaderboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Durasi: {quiz.duration_minutes} menit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Passing Score: {quiz.passing_score}%</span>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold mb-2">Jumlah Soal: {questions.length}</p>
                <p className="text-sm text-muted-foreground">
                  Pastikan koneksi internet Anda stabil. Timer akan berjalan otomatis setelah quiz dimulai.
                </p>
              </div>
              <Button onClick={startQuiz} className="w-full" size="lg">
                Mulai Quiz Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5 text-primary" />
            <span className={timeRemaining < 60 ? 'text-destructive' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="text-muted-foreground">
            Soal {currentQuestionIndex + 1} dari {questions.length}
          </div>
        </div>

        <Progress value={progress} className="mb-6" />

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </CardTitle>
            <CardDescription>{currentQuestion.points} poin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Sebelumnya
              </Button>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button onClick={handleSubmitQuiz}>
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                >
                  Selanjutnya
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizDetail;
