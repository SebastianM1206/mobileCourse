import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FirebaseError } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authError: string | null;
  register: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Ese correo ya esta registrado.";
      case "auth/invalid-email":
        return "El correo no es valido.";
      case "auth/weak-password":
        return "La contrasena debe tener al menos 6 caracteres.";
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Credenciales invalidas.";
      default:
        return "No fue posible autenticar al usuario.";
    }
  }

  return "Ocurrio un error de autenticacion.";
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPersistenceReady, setIsPersistenceReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Fallback defensivo para evitar pantalla en negro si Firebase no responde.
    const loadingTimeout = window.setTimeout(() => {
      if (!isMounted) {
        return;
      }

      setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!isMounted) {
          return;
        }

        window.clearTimeout(loadingTimeout);
        setUser(currentUser);
        setLoading(false);
      },
      () => {
        if (!isMounted) {
          return;
        }

        window.clearTimeout(loadingTimeout);
        setLoading(false);
        setAuthError("No se pudo inicializar la sesion. Intenta recargar la app.");
      }
    );

    return () => {
      isMounted = false;
      window.clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  const ensurePersistence = async (): Promise<void> => {
    if (isPersistenceReady) {
      return;
    }

    await setPersistence(auth, browserLocalPersistence);
    setIsPersistenceReady(true);
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);

    try {
      await ensurePersistence();
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);

    try {
      await ensurePersistence();
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setAuthError(null);

    try {
      await signOut(auth);
    } catch (error) {
      setAuthError("No se pudo cerrar sesion.");
    }
  };

  const clearAuthError = (): void => {
    setAuthError(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authError,
      register,
      login,
      logout,
      clearAuthError,
    }),
    [authError, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
