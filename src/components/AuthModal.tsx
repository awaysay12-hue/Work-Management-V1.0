import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { UserAccount } from '../types';
import { verifyUserLogin } from '../utils/userPermissions';
import { fetchUsersFromSupabase } from '../lib/supabase';
import { soundFx } from '../utils/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterUser?: (newUser: UserAccount) => void;
  users?: UserAccount[];
  currentUser?: UserAccount;
  forceLoginScreen?: boolean;
  isFullScreen?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  users = [],
  forceLoginScreen = false,
  isFullScreen = false,
}) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const [emailOrName, setEmailOrName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // 1. First attempt with local & passed users
      let result = verifyUserLogin(emailOrName, password, safeUsers);

      // 2. If not found locally, query Supabase Cloud Database directly in real-time
      if (!result.success) {
        try {
          const { users: remoteUsers } = await fetchUsersFromSupabase();
          if (remoteUsers && remoteUsers.length > 0) {
            result = verifyUserLogin(emailOrName, password, remoteUsers);
            if (result.success && result.user) {
              // Update localStorage with fresh users list
              try {
                localStorage.setItem('taskmate_users', JSON.stringify(remoteUsers));
                localStorage.setItem('kh_daily_users_data_v1', JSON.stringify(remoteUsers));
              } catch {
                // Ignore
              }
            }
          }
        } catch {
          // Ignore network errors in fallback
        }
      }

      setIsLoading(false);

      if (result.success && result.user) {
        soundFx.playCelebration();
        setSuccessMessage(`ស្វាគមន៍ការត្រឡប់មកវិញ! សួស្តី ${result.user.khmerName}`);
        
        // Remember session in localStorage
        try {
          localStorage.setItem('taskmate_current_user_id', result.user.id);
          localStorage.setItem('kh_daily_current_user_id_v1', result.user.id);
          localStorage.setItem('taskmate_auth_authenticated', 'true');
          localStorage.setItem('kh_daily_auth_authenticated_v1', 'true');
        } catch {
          // Ignore
        }

        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 300);
      } else {
        soundFx.playAlert();
        setErrorMessage(result.message || 'ការចូលប្រើប្រាស់មិនជោគជ័យ! សូមពិនិត្យអ៊ីមែល ឬពាក្យសម្ងាត់');
      }
    } catch {
      setIsLoading(false);
      soundFx.playAlert();
      setErrorMessage('មានបញ្ហាបច្ចេកទេសក្នុងការផ្ទៀងផ្ទាត់គណនី សូមសាកល្បងម្តងទៀត');
    }
  };

  const content = (
    <div
      id="auth-modal-card"
      className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-auto animate-scale-in"
    >
      {/* Top Decorative Header */}
      <div className="relative px-6 pt-7 pb-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-b border-indigo-900/40">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-2 ring-white/20 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>ប្រព័ន្ធចូលប្រើប្រាស់</span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  Protected
                </span>
              </h2>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                សូមបញ្ចូលគណនីដែលបានបង្កើតដោយ Super Admin
              </p>
            </div>
          </div>

          {onClose && !forceLoginScreen && !isFullScreen && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm cursor-pointer"
              title="បិទ"
            >
              ✕
            </button>
          )}
        </div>

        {/* Security Info Badge */}
        <div className="mt-4 flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 rounded-2xl border border-indigo-500/30 text-xs text-indigo-200 shadow-inner">
          <div className="flex items-center gap-2">
            <LogIn className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white">ចូលប្រើប្រាស់គណនី (Sign In)</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-md border border-amber-500/30">
            🔒 គ្មានសិទ្ធិ Sign-Up ដោយខ្លួនឯង
          </span>
        </div>
      </div>

      {/* Modal Body */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Alerts */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* SIGN IN FORM ONLY */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Identifier */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              អ៊ីមែល ឬ ឈ្មោះគណនី (Email or Username)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={emailOrName}
                onChange={(e) => setEmailOrName(e.target.value)}
                placeholder="បញ្ចូលអ៊ីមែល ឬឈ្មោះគណនី..."
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ពាក្យសម្ងាត់ (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="បញ្ចូលពាក្យសម្ងាត់..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400 font-medium tracking-wide"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title={showPassword ? 'លាក់ពាក្យសម្ងាត់' : 'បង្ហាញពាក្យសម្ងាត់'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
              />
              <span>ចងចាំការចូលប្រើប្រាស់នេះ</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>ចូលទៅកាន់ផ្ទាំងការងារ (Sign In)</span>
              </>
            )}
          </button>

          {/* Super Admin Provisioning Notice */}
          <div className="pt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              🔒 <span className="font-bold text-slate-800">ចំណាំ៖</span> អ្នកប្រើប្រាស់មិនអាចចុះឈ្មោះ (Sign Up) ដោយខ្លួនឯងបានឡើយ។ គណនីត្រូវតែបង្កើត និងកំណត់សិទ្ធិតួនាទីដោយ <span className="font-bold text-indigo-700">Super Admin</span> ផ្ទាល់នៅក្នុងប្រព័ន្ធគ្រប់គ្រងសមាជិក (User Management)។
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  if (isFullScreen) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto transition-all animate-fade-in">
      {content}
    </div>
  );
};
