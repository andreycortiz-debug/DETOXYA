import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../features/profile/useProfile';
import { Splash } from './Splash';

export function RequireSetup({ children }: { children: ReactNode }) {
  const profile = useProfile();
  if (profile === undefined) return <Splash />;
  if (profile === null || profile.onboardedAt === null) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}
