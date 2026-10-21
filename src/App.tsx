import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { RequireSetup } from './components/RequireSetup';
import { CrisisOverlay } from './components/CrisisOverlay';
import { PinGate } from './components/PinGate';
import { Splash } from './components/Splash';
import { OnboardingPage } from './features/onboarding/OnboardingPage';

const TodayPage = lazy(() =>
  import('./features/today/TodayPage').then((m) => ({ default: m.TodayPage })),
);
const CravingsPage = lazy(() =>
  import('./features/cravings/CravingsPage').then((m) => ({ default: m.CravingsPage })),
);
const UrgeSurfPage = lazy(() =>
  import('./features/cravings/CravingsPage').then((m) => ({ default: m.UrgeSurfPage })),
);
const BreathPage = lazy(() =>
  import('./features/cravings/CravingsPage').then((m) => ({ default: m.BreathPage })),
);
const TriggersPage = lazy(() =>
  import('./features/cravings/TriggersPage').then((m) => ({ default: m.TriggersPage })),
);
const HaltPage = lazy(() =>
  import('./features/halt/HaltPage').then((m) => ({ default: m.HaltPage })),
);
const ProgramPage = lazy(() =>
  import('./features/program/ProgramPage').then((m) => ({ default: m.ProgramPage })),
);
const WithdrawalPage = lazy(() =>
  import('./features/program/ProgramPage').then((m) => ({ default: m.WithdrawalPage })),
);
const CbtCoursePage = lazy(() =>
  import('./features/program/ProgramCourses').then((m) => ({ default: m.CbtCoursePage })),
);
const CbtLessonPage = lazy(() =>
  import('./features/program/ProgramCourses').then((m) => ({ default: m.CbtLessonPage })),
);
const MbrpPage = lazy(() =>
  import('./features/program/ProgramCourses').then((m) => ({ default: m.MbrpPage })),
);
const MbrpPracticePage = lazy(() =>
  import('./features/program/ProgramCourses').then((m) => ({ default: m.MbrpPracticePage })),
);
const PawsPage = lazy(() =>
  import('./features/program/ProgramCourses').then((m) => ({ default: m.PawsPage })),
);
const JournalPage = lazy(() =>
  import('./features/journal/JournalPage').then((m) => ({ default: m.JournalPage })),
);
const CoachPage = lazy(() =>
  import('./features/coach/CoachPage').then((m) => ({ default: m.CoachPage })),
);
const MorePage = lazy(() =>
  import('./features/more/MorePage').then((m) => ({ default: m.MorePage })),
);
const DashboardPage = lazy(() =>
  import('./features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const PathsPage = lazy(() =>
  import('./features/paths/PathsPage').then((m) => ({ default: m.PathsPage })),
);
const SettingsPage = lazy(() =>
  import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const HelpPage = lazy(() =>
  import('./features/help/HelpPage').then((m) => ({ default: m.HelpPage })),
);

function Fallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Splash />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CrisisOverlay />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          {/* /help es siempre accesible, incluso con la app bloqueada por PIN. */}
          <Route
            path="/help"
            element={
              <div className="mx-auto min-h-dvh max-w-lg px-4 py-6">
                <HelpPage />
              </div>
            }
          />
          <Route
            element={
              <RequireSetup>
                <PinGate>
                  <AppShell />
                </PinGate>
              </RequireSetup>
            }
          >
            <Route path="/" element={<TodayPage />} />
            <Route path="/cravings" element={<CravingsPage />} />
            <Route path="/cravings/surf" element={<UrgeSurfPage />} />
            <Route path="/cravings/breath" element={<BreathPage />} />
            <Route path="/halt" element={<HaltPage />} />
            <Route path="/triggers" element={<TriggersPage />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/program/withdrawal" element={<WithdrawalPage />} />
            <Route path="/program/paws" element={<PawsPage />} />
            <Route path="/program/cbt" element={<CbtCoursePage />} />
            <Route path="/program/cbt/:lessonId" element={<CbtLessonPage />} />
            <Route path="/program/mbrp" element={<MbrpPage />} />
            <Route path="/program/mbrp/:practiceId" element={<MbrpPracticePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/coach" element={<CoachPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/paths" element={<PathsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
