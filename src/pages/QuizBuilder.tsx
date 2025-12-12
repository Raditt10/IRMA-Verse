import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowLeft, ArrowRight, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  points: number;
}

const QuizBuilder = () => {
  const [step, setStep] = useState(1);
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    duration_minutes: 30,
    passing_score: 70,
  });
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correct_answer: "", points: 10 }
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correct_answer: "", points: 10 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from("quiz")
        .insert([{
          ...quizData,
          created_by: session.user.id,
        }])
        .select()
        .single();

      if (quizError) throw quizError;

      // Create questions
      const questionsData = questions.map((q, index) => ({
        quiz_id: quiz.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        points: q.points,
        order_number: index + 1,
      }));

      const { error: questionsError } = await supabase
        .from("quiz_questions")
        .insert(questionsData);

      if (questionsError) throw questionsError;

      toast({
        title: "Berhasil",
        description: "Quiz berhasil dibuat!",
      });

      navigate("/admin");
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

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Quiz</CardTitle>
        <CardDescription>Isi informasi dasar quiz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Judul Quiz</Label>
          <Input
            id="title"
            value={quizData.title}
            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={quizData.description}
            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Durasi (menit)</Label>
            <Input
              id="duration"
              type="number"
              value={quizData.duration_minutes}
              onChange={(e) => setQuizData({ ...quizData, duration_minutes: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="passing_score">Passing Score (%)</Label>
            <Input
              id="passing_score"
              type="number"
              value={quizData.passing_score}
              onChange={(e) => setQuizData({ ...quizData, passing_score: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      {questions.map((q, qIndex) => (
        <Card key={qIndex}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Soal {qIndex + 1}</CardTitle>
              {questions.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Pertanyaan</Label>
              <Textarea
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                rows={3}
                required
              />
            </div>
            <div>
              <Label>Opsi Jawaban</Label>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-2 items-center">
                    <span className="text-sm font-medium">{String.fromCharCode(65 + oIndex)}.</span>
                    <Input
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Opsi ${String.fromCharCode(65 + oIndex)}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Jawaban Benar</Label>
                <select
                  className="w-full p-2 border rounded-md bg-background"
                  value={q.correct_answer}
                  onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                  required
                >
                  <option value="">Pilih Jawaban</option>
                  {q.options.map((option, oIndex) => (
                    <option key={oIndex} value={option}>
                      {String.fromCharCode(65 + oIndex)}. {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Poin</Label>
                <Input
                  type="number"
                  value={q.points}
                  onChange={(e) => updateQuestion(qIndex, "points", parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addQuestion} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Tambah Soal
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Review Quiz</CardTitle>
        <CardDescription>Periksa kembali quiz sebelum disimpan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{quizData.title}</h3>
          <p className="text-muted-foreground">{quizData.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Durasi:</span> {quizData.duration_minutes} menit
          </div>
          <div>
            <span className="text-muted-foreground">Passing Score:</span> {quizData.passing_score}%
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Jumlah Soal: {questions.length}</h4>
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Soal {index + 1}: {q.question}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Jawaban: {q.correct_answer} ({q.points} poin)
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Quiz Builder
          </h1>
          <p className="text-muted-foreground">
            Buat quiz baru dengan wizard step-by-step
          </p>
        </div>

        <div className="mb-8 flex items-center justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-24 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Sebelumnya
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Selanjutnya
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Menyimpan..." : "Simpan Quiz"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;
