import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  auth, 
  googleProvider, 
  db,
  handleFirestoreError,
  OperationType 
} from '../../firebase/config';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../../types';
import { 
  Flame, 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onRegistrationSuccess?: (userData: { uid: string; email: string; name: string; avatar?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onRegistrationSuccess
}) => {
  const { loginAs, setAllUsers, setActiveTab, triggerCelebration } = useApp();
  
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user document already exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      let userDocSnap;
      try {
        userDocSnap = await getDoc(userDocRef);
      } catch (err) {
        console.warn('Could not read user doc from server:', err);
      }

      if (userDocSnap && userDocSnap.exists()) {
        const profileData = userDocSnap.data();
        setAllUsers((prev: User[]) => {
          const exists = prev.some((u: User) => u.id === user.uid);
          if (exists) return prev.map((u: User) => u.id === user.uid ? { ...u, ...profileData } : u);
          return [profileData as any, ...prev];
        });
        loginAs(user.uid);
        onClose();
        triggerCelebration();
      } else {
        // First-time user via Google -> send to OnboardingFlow with pre-filled Google data
        const displayName = user.displayName || 'Joven Cristiano';
        const parts = displayName.split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';

        onClose();
        if (onRegistrationSuccess) {
          onRegistrationSuccess({
            uid: user.uid,
            email: user.email || '',
            name: firstName,
            avatar: user.photoURL || undefined
          });
        }
        setActiveTab('onboarding');
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setErrorMessage('La ventana de Google fue cerrada antes de completar el acceso.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setErrorMessage('Solicitud cancelada.');
      } else {
        setErrorMessage(error.message || 'Error al conectar con Google Authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'login') {
        // Sign In
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = cred.user;

        // Try reading Firestore user profile
        try {
          const userDocSnap = await getDoc(doc(db, 'users', user.uid));
          if (userDocSnap.exists()) {
            const profile = userDocSnap.data();
            setAllUsers((prev: User[]) => {
              const exists = prev.some((u: User) => u.id === user.uid);
              if (exists) return prev.map((u: User) => u.id === user.uid ? { ...u, ...profile } : u);
              return [profile as any, ...prev];
            });
          }
        } catch (err) {
          console.warn('Firestore read profile error:', err);
        }

        loginAs(user.uid);
        onClose();
        triggerCelebration();
      } else {
        // Register New Account
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = cred.user;

        if (name.trim()) {
          await updateProfile(user, { displayName: name.trim() });
        }

        onClose();
        if (onRegistrationSuccess) {
          onRegistrationSuccess({
            uid: user.uid,
            email: user.email || email.trim(),
            name: name.trim() || 'Joven Cristiano',
          });
        }
        setActiveTab('onboarding');
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMessage('Correo o contraseña incorrectos. Verifica tus credenciales.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Este correo ya está registrado. Por favor, selecciona "Iniciar Sesión".');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('El formato de correo electrónico no es válido.');
      } else if (error.code === 'auth/operation-not-allowed') {
        setErrorMessage('El proveedor Email/Contraseña requiere activación en Firebase Console. Te recomendamos usar "Continuar con Google".');
      } else {
        setErrorMessage(error.message || 'Error en la autenticación. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white shadow-lg mb-3 fire-glow">
            <Flame className="h-6 w-6 fill-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white font-heading">
            {mode === 'login' ? 'Iniciar Sesión en tu Cuenta' : 'Crea tu Cuenta con Firebase'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {mode === 'login' 
              ? 'Accede a tu ficha de jugador, retos y comunidad juvenil adventista.'
              : 'Regístrate para comenzar tu aventura espiritual con 00 puntos.'}
          </p>
        </div>

        {/* Error message box */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Google One-Click Auth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] mb-4 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"
              />
            </svg>
          )}
          <span>{mode === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            O con correo electrónico
          </span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Nombre y Apellido:
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Daniel Morales"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Correo Electrónico:
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu_correo@ejemplo.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Contraseña:
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-black hover:from-amber-400 hover:to-orange-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 mt-4 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Ingresar a la Plataforma' : 'Continuar al Onboarding'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              ¿No tienes una cuenta aún?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className="text-amber-400 hover:underline font-bold"
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta registrada?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className="text-amber-400 hover:underline font-bold"
              >
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Protegido con Firebase Auth & Encriptación SSL</span>
        </div>

      </div>
    </div>
  );
};
