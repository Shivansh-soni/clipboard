import { ID, Query, type Models } from "appwrite";
import { account, databases } from "@/lib/appwrite";
import {
  User,
  CreateUserData,
  UpdateUserData,
  LoginCredentials,
  ChangePasswordRequest,
  PasswordResetRequest,
  CompletePasswordReset,
  Invitation,
  CreateInvitationData,
  InvitationStatus,
  UserStatus,
  UserRole,
} from "@/lib/types/users";

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "clipboard_db";
const USERS_COLLECTION =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "users";
const INVITATIONS_COLLECTION =
  process.env.NEXT_PUBLIC_APPWRITE_INVITATIONS_COLLECTION_ID || "invitations";

// Helper function to map Appwrite user to our User type
const mapAppwriteUser = (user: Models.Document): User => ({
  $id: user.$id,
  $createdAt: user.$createdAt,
  $updatedAt: user.$updatedAt,
  email: user.email,
  name: user.name,
  status: user.status,
  prefs: {
    role: user.role || "user",
  },
  phone: user.phone,
  emailVerification: user.emailVerification,
  phoneVerification: user.phoneVerification,
});

// Helper function to map Appwrite invitation to our Invitation type
const mapAppwriteInvitation = (invitation: Models.Document): Invitation => ({
  $id: invitation.$id,
  $collectionId: invitation.$collectionId,
  $databaseId: invitation.$databaseId,
  $createdAt: invitation.$createdAt,
  $updatedAt: invitation.$updatedAt,
  $permissions: invitation.$permissions || [],
  email: invitation.email,
  token: invitation.token,
  role: invitation.role,
  status: invitation.status,
  invitedBy: invitation.invitedBy,
  expiresAt: invitation.expiresAt,
  acceptedAt: invitation.acceptedAt,
  userId: invitation.userId,
});

/**
 * User Management Functions
 */

export const userService = {
  // Create a new user (admin only)
  async createUser(userData: CreateUserData): Promise<User> {
    const { email, name, password, role = "user" } = userData;

    // Create user in Appwrite Auth
    const accountData: any = await account.create(
      ID.unique(),
      email,
      password!,
      name
    );

    // Create user document in database
    const userDoc = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION,
      ID.unique(),
      {
        email,
        name,
        status: password ? "active" : "pending",
        role,
        phone: "",
      }
    );

    return mapAppwriteUser(userDoc);
  },

  // Get current authenticated user
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get();
      if (!user) return null;

      const userDoc = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION,
        [Query.equal("email", user.email)]
      );

      if (userDoc.documents.length === 0) return null;
      return mapAppwriteUser(userDoc.documents[0]);
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  // Get user by ID (admin only)
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION,
        userId
      );
      return mapAppwriteUser(userDoc);
    } catch (error) {
      console.error(`Error getting user ${userId}:`, error);
      return null;
    }
  },

  // Update user
  async updateUser(
    userId: string,
    updates: UpdateUserData
  ): Promise<User | null> {
    try {
      const userDoc = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION,
        userId,
        updates
      );
      return mapAppwriteUser(userDoc);
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      return null;
    }
  },

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION, userId);

      // Also delete the auth account
      await account.deleteIdentity(userId);

      return true;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      return false;
    }
  },

  // List all users (admin only)
  async listUsers(queries: string[] = []): Promise<User[]> {
    try {
      const users = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION,
        queries
      );
      return users.documents.map(mapAppwriteUser);
    } catch (error) {
      console.error("Error listing users:", error);
      return [];
    }
  },

  /**
   * Authentication Functions
   */

  // Login user
  async login(credentials: LoginCredentials): Promise<User | null> {
    const { email, password, rememberMe } = credentials;

    try {
      await account.createEmailPasswordSession(email, password);

      if (rememberMe) {
        // Extend session duration if remember me is checked
        await account.updateSession("current");
      }

      return this.getCurrentUser();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<boolean> {
    try {
      await account.deleteSession("current");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  },

  // Request password reset
  async requestPasswordReset({
    email,
    url,
  }: PasswordResetRequest): Promise<boolean> {
    try {
      await account.createRecovery(email, url);
      return true;
    } catch (error) {
      console.error("Password reset request failed:", error);
      return false;
    }
  },

  // Complete password reset
  async completePasswordReset({
    userId,
    secret,
    password,
    passwordAgain,
  }: CompletePasswordReset): Promise<boolean> {
    try {
      await account.updateRecovery(userId, secret, password);
      return true;
    } catch (error) {
      console.error("Password reset failed:", error);
      return false;
    }
  },

  // Change password
  async changePassword({
    currentPassword,
    newPassword,
    newPasswordAgain,
  }: ChangePasswordRequest): Promise<boolean> {
    try {
      await account.updatePassword(newPassword, currentPassword);
      return true;
    } catch (error) {
      console.error("Password change failed:", error);
      return false;
    }
  },

  /**
   * Invitation Management
   */

  // Create a new invitation
  async createInvitation(
    invitationData: CreateInvitationData,
    invitedById: string
  ): Promise<Invitation | null> {
    const { email, role = "user", expiresInDays = 7 } = invitationData;

    try {
      // Generate a unique token
      const token = ID.unique();

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const invitation = await databases.createDocument(
        DATABASE_ID,
        INVITATIONS_COLLECTION,
        ID.unique(),
        {
          email,
          token,
          role,
          status: "pending",
          invitedBy: invitedById,
          expiresAt: expiresAt.toISOString(),
        }
      );

      return mapAppwriteInvitation(invitation);
    } catch (error) {
      console.error("Error creating invitation:", error);
      return null;
    }
  },

  // Get invitation by token
  async getInvitationByToken(token: string): Promise<Invitation | null> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        INVITATIONS_COLLECTION,
        [
          Query.equal("token", token),
          Query.equal("status", "pending"),
          Query.greaterThan("expiresAt", new Date().toISOString()),
        ]
      );

      if (result.documents.length === 0) return null;
      return mapAppwriteInvitation(result.documents[0]);
    } catch (error) {
      console.error("Error getting invitation:", error);
      return null;
    }
  },

  // Accept invitation
  async acceptInvitation(
    token: string,
    userId: string,
    password: string
  ): Promise<boolean> {
    try {
      const invitation = await this.getInvitationByToken(token);
      if (!invitation) return false;

      // Update invitation
      await databases.updateDocument(
        DATABASE_ID,
        INVITATIONS_COLLECTION,
        invitation.$id,
        {
          status: "accepted",
          acceptedAt: new Date().toISOString(),
          userId,
        }
      );

      // Update user status to active
      await this.updateUser(userId, {
        status: "active",
      });

      // Update user password if provided
      if (password) {
        await account.updatePassword(password);
      }

      return true;
    } catch (error) {
      console.error("Error accepting invitation:", error);
      return false;
    }
  },

  // List invitations
  async listInvitations(queries: string[] = []): Promise<Invitation[]> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        INVITATIONS_COLLECTION,
        queries
      );

      return result.documents.map(mapAppwriteInvitation);
    } catch (error) {
      console.error("Error listing invitations:", error);
      return [];
    }
  },

  // Revoke invitation
  async revokeInvitation(invitationId: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        INVITATIONS_COLLECTION,
        invitationId,
        {
          status: "revoked",
        }
      );

      return true;
    } catch (error) {
      console.error("Error revoking invitation:", error);
      return false;
    }
  },

  // Check if email is already invited
  async isEmailInvited(email: string): Promise<boolean> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        INVITATIONS_COLLECTION,
        [
          Query.equal("email", email),
          Query.notEqual("status", "revoked"),
          Query.notEqual("status", "expired"),
        ]
      );

      return result.documents.length > 0;
    } catch (error) {
      console.error("Error checking if email is invited:", error);
      return false;
    }
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION,
        [Query.equal("email", email)]
      );

      if (result.documents.length === 0) return null;
      return mapAppwriteUser(result.documents[0]);
    } catch (error) {
      console.error("Error getting user by email:", error);
      return null;
    }
  },

  // Update user status
  async updateUserStatus(
    userId: string,
    status: UserStatus
  ): Promise<User | null> {
    return this.updateUser(userId, { status });
  },

  // Update user role (admin only)
  async updateUserRole(userId: string, role: UserRole): Promise<User | null> {
    return this.updateUser(userId, { role });
  },

  // Check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      return user?.prefs.role === "admin";
    } catch (error) {
      console.error("Error checking if user is admin:", error);
      return false;
    }
  },
};
