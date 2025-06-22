// User roles
export type UserRole = "admin" | "user";

// User statuses
export type UserStatus = "active" | "pending" | "suspended";

// Base user interface (matches Appwrite's user model with our custom fields)
export interface User extends Record<string, unknown> {
  $id: string; // Appwrite user ID
  $createdAt: string; // ISO date string
  $updatedAt: string; // ISO date string
  email: string; // User's email address (unique)
  name: string; // User's full name
  status: UserStatus; // Account status
  prefs: {
    // User preferences
    role: UserRole; // User's role
    // Add other preferences as needed
  };
  phone?: string; // Optional phone number
  emailVerification: boolean; // Whether email is verified
  phoneVerification: boolean; // Whether phone is verified
}

// User creation data (for admin creating users)
export interface CreateUserData {
  email: string;
  name: string;
  password?: string; // Optional, if not using email verification
  role?: UserRole; // Defaults to 'user' if not specified
  sendInvite?: boolean; // Whether to send invitation email
}

// User update data
export interface UpdateUserData {
  name?: string;
  status?: UserStatus;
  role?: UserRole;
  phone?: string | null;
}

// Invitation status
export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked";

// Invitation model
export interface Invitation {
  $id: string; // Appwrite document ID
  $collectionId: string; // Collection ID
  $databaseId: string; // Database ID
  $createdAt: string; // ISO date string
  $updatedAt: string; // ISO date string
  $permissions: string[]; // Document permissions

  email: string; // Invited email
  token: string; // Unique invitation token
  role: UserRole; // Role being invited for
  expiresAt: string; // ISO date string
  status: InvitationStatus; // Invitation status
  invitedBy: string; // User ID of admin who sent invite
  acceptedAt?: string; // ISO date string when accepted
  userId?: string; // User ID if invitation was accepted
}

// Invitation creation data
export interface CreateInvitationData {
  email: string;
  role?: UserRole; // Defaults to 'user'
  expiresInDays?: number; // Defaults to 7 days
}

// Authentication response
export interface AuthResponse {
  user: User;
  session: {
    $id: string;
    userId: string;
    expire: string; // ISO date string
    provider: string;
    providerUid: string;
    providerAccessToken: string;
    providerAccessTokenExpiry: string; // ISO date string
    providerRefreshToken: string;
    ip: string;
    osCode: string;
    osName: string;
    osVersion: string;
    clientType: string;
    clientCode: string;
    clientName: string;
    clientVersion: string;
    clientEngine: string;
    clientEngineVersion: string;
    deviceName: string;
    deviceBrand: string;
    deviceModel: string;
    countryCode: string;
    countryName: string;
    current: boolean;
    factors: string[];
    secret: string;
    mfaUpdatedAt: string; // ISO date string
  };
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Password reset request
export interface PasswordResetRequest {
  email: string;
  url: string; // Reset password URL (frontend route)
}

// Complete password reset
export interface CompletePasswordReset {
  userId: string;
  secret: string; // Token from reset email
  password: string;
  passwordAgain: string;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordAgain: string;
}

// User statistics
export interface UserStats {
  totalItems: number;
  totalStorage: number; // in bytes
  lastActive: string; // ISO date string
  // Add more stats as needed
}
