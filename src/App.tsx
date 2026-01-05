import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Structure from "./pages/Structure";
import Gallery from "./pages/Gallery";
import Schedule from "./pages/Schedule";
import Materials from "./pages/Materials";
import Achievements from "./pages/Achievements";
import Ratings from "./pages/Ratings";
import Quiz from "./pages/Quiz";
import QuizDetail from "./pages/QuizDetail";
import QuizBuilder from "./pages/QuizBuilder";
import Leaderboard from "./pages/Leaderboard";
import Badges from "./pages/Badges";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import ChatRooms from "./pages/ChatRooms";
import ChatRoom from "./pages/ChatRoom";
import Profile from "./pages/Profile";
import ActivityHistory from "./pages/ActivityHistory";
import AdminPanel from "./pages/AdminPanel";
import PemateriDashboard from "./pages/PemateriDashboard";
import Absensi from "./pages/Absensi";
import AdminAbsensi from "./pages/AdminAbsensi";
import Instructors from "./pages/Instructors";
import OurPrograms from "./pages/OurPrograms";
import Competitions from "./pages/Competitions";
import Members from "./pages/Members";
import News from "./pages/News";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/programs" element={<OurPrograms />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/members" element={<Members />} />
            <Route path="/news" element={<News />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/ratings" element={<Ratings />} />
            <Route path="/structure" element={<Structure />} />
            <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/absensi" element={<AdminAbsensi />} />
          <Route path="/pemateri" element={<PemateriDashboard />} />
          <Route path="/absensi" element={<Absensi />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-detail/:id" element={<QuizDetail />} />
          <Route path="/quiz-builder" element={<QuizBuilder />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/chat-rooms" element={<ChatRooms />} />
          <Route path="/chat/:id" element={<ChatRoom />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity-history" element={<ActivityHistory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
