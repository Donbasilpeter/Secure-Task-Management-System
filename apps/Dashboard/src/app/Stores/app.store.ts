import { signalStore, withState } from '@ngrx/signals';

type AppState = {
  appName: string;
  features: { title: string; description: string }[];
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>({
    appName: 'Secure Task Manager',
    features: [
      {
        title: '✅ Task Management',
        description: 'Create, assign, and track tasks easily with role-based access.'
      },
      {
        title: '👥 Team Collaboration',
        description: 'Work seamlessly with Owners, Admins, and Viewers in departments.'
      },
      {
        title: '🔒 Secure Access',
        description: 'Fine-grained permissions ensure only the right people can edit.'
      }
    ]
  })
);
