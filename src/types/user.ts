export interface User {
  id: number;  // Changed from string to number to match backend
  email: string;
  name: string;
  isEmailVerified: boolean;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  privacySettings: 'public' | 'private';
  notificationPreferences: {
    email: boolean;
    push: boolean;
  };
  languagePreference: string;
  accessibilityOptions: {
    highContrast: boolean;
    largeText: boolean;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}