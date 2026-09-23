import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { CommandCenterPage } from '../pages/CommandCenterPage';
import { ProjectExplorerPage } from '../pages/ProjectExplorerPage';
import { ProjectIntelligencePage } from '../pages/ProjectIntelligencePage';
import { RiskCenterPage } from '../pages/RiskCenterPage';
import { AlertsPage } from '../pages/AlertsPage';
import { BenchmarkingPage } from '../pages/BenchmarkingPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { ScenariosPage } from '../pages/ScenariosPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <CommandCenterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <ProjectExplorerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/projects/:id',
    element: (
      <ProtectedRoute>
        <ProjectIntelligencePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/risk',
    element: (
      <ProtectedRoute>
        <RiskCenterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/alerts',
    element: (
      <ProtectedRoute>
        <AlertsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/benchmarking',
    element: (
      <ProtectedRoute>
        <BenchmarkingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <AnalyticsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/scenarios',
    element: (
      <ProtectedRoute>
        <ScenariosPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);
