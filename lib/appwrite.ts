import { Client, Account, Databases, Storage } from "appwrite";

const appwriteClient = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

// Initialize Appwrite services
export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);

export default appwriteClient;

export const appwritePing = async () => {
  try {
    const client = appwriteClient;
    await client.ping();
    return true;
  } catch (error) {
    console.error("No active session");
    return null;
  }
};

export const login = async (email: string, password: string) => {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
