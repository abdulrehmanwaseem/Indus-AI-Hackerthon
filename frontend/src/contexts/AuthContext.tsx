import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  getGoogleOAuthUrl,
  isAuthenticated as checkIsAuthenticated,
  updateProfile as apiUpdateProfile,
  tokenManager,
  getErrorMessage,
  type UserProfile,
  type LoginRequest,
  type RegisterRequest,
  type ProfileUpdateRequest,
} from "@/lib/api";

// ─────────────────────────────────────────────────────────────
// Auth Context Types
// ─────────────────────────────────────────────────────────────

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  handleOAuthCallback: (
    accessToken: string,
    refreshToken: string
  ) => Promise<UserProfile>;
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────
// Auth Provider Component
// ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      if (checkIsAuthenticated()) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch {
          // Token invalid or expired — clear it
          tokenManager.clearTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiLogin(data);
      setUser(response.user);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRegister(data);
      setUser(response.user);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    setError(null);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await getGoogleOAuthUrl();
      window.location.href = url;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const handleOAuthCallback = useCallback(
    async (accessToken: string, refreshToken: string): Promise<UserProfile> => {
      setIsLoading(true);
      setError(null);
      try {
        tokenManager.setTokens(accessToken, refreshToken);
        const userData = await getCurrentUser();
        setUser(userData);
        return userData;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        tokenManager.clearTokens();
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateProfile = useCallback(async (data: ProfileUpdateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await apiUpdateProfile(data);
      setUser(updatedUser);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
    handleOAuthCallback,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────────────────────
// useAuth Hook
// ─────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
