import { Route, Routes } from 'react-router-dom'
import { RouteGuard } from '@/components/RouteGuard'
import { ScreenIndex } from '@/components/ScreenIndex'
import LandingPage from '@/pages/user/LandingPage'
import LibraryPage from '@/pages/user/LibraryPage'
import FaqDetailPage from '@/pages/user/FaqDetailPage'
import LoginPage from '@/pages/user/LoginPage'
import RegisterPage from '@/pages/user/RegisterPage'
import AskQuestionPage from '@/pages/user/AskQuestionPage'
import AnalysisPage from '@/pages/user/AnalysisPage'
import DiscussionsPage from '@/pages/user/DiscussionsPage'
import DiscussionThreadPage from '@/pages/user/DiscussionThreadPage'
import CreateDiscussionPage from '@/pages/user/CreateDiscussionPage'
import ProfilePage from '@/pages/user/ProfilePage'
import NotificationsPage from '@/pages/user/NotificationsPage'
import SavedKnowledgePage from '@/pages/user/SavedKnowledgePage'
import ContributionsPage from '@/pages/user/ContributionsPage'
import UserSettingsPage from '@/pages/user/UserSettingsPage'
import EvolutionPage from '@/pages/user/EvolutionPage'
import MethodologyPage from '@/pages/user/MethodologyPage'
import MissionControlPage from '@/pages/admin/MissionControlPage'
import FaqManagementPage from '@/pages/admin/FaqManagementPage'
import FaqCandidateReviewPage from '@/pages/admin/FaqCandidateReviewPage'
import ModerationPage from '@/pages/admin/ModerationPage'
import AnalyticsPage from '@/pages/admin/AnalyticsPage'
import ReportInvestigationPage from '@/pages/admin/ReportInvestigationPage'
import SettingsPage from '@/pages/admin/SettingsPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/faq/:id" element={<FaqDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ask" element={<RouteGuard allow={['user', 'admin']}><AskQuestionPage /></RouteGuard>} />
        <Route path="/analysis/:id" element={<RouteGuard allow={['user', 'admin']}><AnalysisPage /></RouteGuard>} />
        <Route path="/discussions" element={<DiscussionsPage />} />
        <Route path="/discussions/new" element={<RouteGuard allow={['user', 'admin']}><CreateDiscussionPage /></RouteGuard>} />
        <Route path="/discussions/:id" element={<DiscussionThreadPage />} />
        <Route path="/home" element={<RouteGuard allow={['user', 'admin']}><ProfilePage /></RouteGuard>} />
        <Route path="/notifications" element={<RouteGuard allow={['user', 'admin']}><NotificationsPage /></RouteGuard>} />
        <Route path="/saved" element={<RouteGuard allow={['user', 'admin']}><SavedKnowledgePage /></RouteGuard>} />
        <Route path="/contributions" element={<RouteGuard allow={['user', 'admin']}><ContributionsPage /></RouteGuard>} />
        <Route path="/settings" element={<RouteGuard allow={['user']}><UserSettingsPage /></RouteGuard>} />
        <Route path="/evolution" element={<EvolutionPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="/admin" element={<RouteGuard allow={['admin']}><MissionControlPage /></RouteGuard>} />
        <Route path="/admin/faq" element={<RouteGuard allow={['admin']}><FaqManagementPage /></RouteGuard>} />
        <Route path="/admin/faq-review/:id?" element={<RouteGuard allow={['admin']}><FaqCandidateReviewPage /></RouteGuard>} />
        <Route path="/admin/moderation" element={<RouteGuard allow={['admin']}><ModerationPage /></RouteGuard>} />
        <Route path="/admin/analytics" element={<RouteGuard allow={['admin']}><AnalyticsPage /></RouteGuard>} />
        <Route path="/admin/reports/:id" element={<RouteGuard allow={['admin']}><ReportInvestigationPage /></RouteGuard>} />
        <Route path="/admin/settings" element={<RouteGuard allow={['admin']}><SettingsPage /></RouteGuard>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ScreenIndex />
    </>
  )
}
