import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import DiscoverPage from "./pages/DiscoverPage";
import AIPage from "./pages/AIPage";
import BookmarksPage from "./pages/BookmarksPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import PastorLoginPage from "./pages/PastorLoginPage";
import PastorDashboard from "./pages/PastorDashboard";
import PastorUploadPage from "./pages/PastorUploadPage";
import DailyMannaUploadPage from "./pages/DailyMannaUploadPage";
import PastorDailyVersePage from "./pages/PastorDailyVersePage";
import PastorReadingPlansPage from "./pages/PastorReadingPlansPage";
import PastorAnnouncementsPage from "./pages/PastorAnnouncementsPage";
import ReadingPlansPage from "./pages/ReadingPlansPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/ai" element={<AIPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/reading-plans" element={<ReadingPlansPage />} />
              <Route path="/pastor/login" element={<PastorLoginPage />} />
              <Route path="/pastor/dashboard" element={<PastorDashboard />} />
              <Route path="/pastor/upload" element={<PastorUploadPage />} />
              <Route path="/pastor/daily-manna" element={<DailyMannaUploadPage />} />
              <Route path="/pastor/daily-verse" element={<PastorDailyVersePage />} />
              <Route path="/pastor/reading-plans" element={<PastorReadingPlansPage />} />
              <Route path="/pastor/announcements" element={<PastorAnnouncementsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
