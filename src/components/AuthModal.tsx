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
  UserPlus,
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { verifyUserLogin } from '../utils/userPermissions';
import { soundFx } from '../utils/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterUser?: (newUser: UserAccount) => void;
  users?: UserAccount[];
  currentUser?: UserAccount;
  forceLoginScreen?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterUser,
  users = [],
  forceLoginScreen = false,
}) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailOrName, setEmailOrName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sign up fields
  const [newName, setNewName] = useState<string>('');
  const [newKhmerName, setNewKhmerName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState<string>('បច្ចេកវិទ្យា & IT');
  const [newRole, setNewRole] = useState<UserRole>('member');

  if (!isOpen) return null;

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = verifyUserLogin(emailOrName, password, safeUsers);
      setIsLoading(false);

      if (result.success && result.user) {
        soundFx.playCelebration();
        setSuccessMessage(`ស្វាគមន៍ការត្រឡប់មកវិញ! សួស្តី ${result.user.khmerName}`);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 300);
      } else {
        soundFx.playAlert();
        setErrorMessage(result.message || 'ការចូលប្រើប្រាស់មិនជោគជ័យ! សូមពិនិត្យម្តងទៀត');
      }
    }, 220);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newKhmerName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setErrorMessage('សូមបំពេញឈ្មោះ អ៊ីមែល និងពាក្យសម្ងាត់ឱ្យបានគ្រប់គ្រាន់');
      return;
    }

    // Check email existence
    const exists = safeUsers.some((u) => u.email.toLowerCase() === newEmail.trim().toLowerCase());
    if (exists) {
      setErrorMessage('អ៊ីមែលនេះមានក្នុងប្រព័ន្ធរួចហើយ! សូមប្រើអ៊ីមែលផ្សេង');
      return;
    }

    const newUserObj: UserAccount = {
      id: `user-${Date.now()}`,
      name: newName.trim() || newKhmerName.trim(),
      khmerName: newKhmerName.trim(),
      email: newEmail.trim().toLowerCase(),
      password: newPassword.trim(),
      phone: newPhone.trim() || '012 000 000',
      role: newRole,
      department: newDepartment,
      avatarColor:
        newRole === 'admin'
          ? 'from-rose-500 to-indigo-600'
          : newRole === 'manager'
          ? 'from-indigo-500 to-cyan-500'
          : newRole === 'viewer'
          ? 'from-slate-500 to-slate-700'
          : 'from-emerald-500 to-teal-600',
      avatarInitial: newKhmerName.trim().charAt(0) || 'U',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    if (onRegisterUser) {
      onRegisterUser(newUserObj);
    }

    soundFx.playCelebration();
    setSuccessMessage('គណនីថ្មីត្រូវបានបង្កើតដោយជោគជ័យ!');
    setTimeout(() => {
      onLoginSuccess(newUserObj);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto transition-all animate-fade-in">
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
                    Smart RBAC
                  </span>
                </h2>
                <p className="text-xs text-indigo-200/80 mt-0.5">
                  ផ្ទាំងចូលគណនី និងគ្រប់គ្រងសិទ្ធិតួនាទីការងារ
                </p>
              </div>
            </div>

            {onClose && !forceLoginScreen && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm cursor-pointer"
                title="បិទ"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 flex bg-slate-900/80 p-1 rounded-2xl border border-indigo-800/40 shadow-inner">
            <button
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.01]'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>ចូលប្រើប្រាស់ (Sign In)</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.01]'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>បង្កើតគណនីថ្មី (Sign Up)</span>
            </button>
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

          {/* SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
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
                    placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ ឬ អ៊ីមែល..."
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    ពាក្យសម្ងាត់ (Password)
                  </label>
                </div>
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
            </form>
          )}

          {/* SIGN UP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ឈ្មោះជាភាសាខ្មែរ *
                  </label>
                  <input
                    type="text"
                    required
                    value={newKhmerName}
                    onChange={(e) => setNewKhmerName(e.target.value)}
                    placeholder="ឧ. បូរ៉ា ស្រេង"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ឈ្មោះជាឡាតាំង (English Name)
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Bora Sreng"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    អ៊ីមែល (Email Address) *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ពាក្យសម្ងាត់ (Password) *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="យ៉ាងតិច ៦ តួអក្សរ..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ផ្នែក / ដេប៉ាតឺម៉ង់
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="បច្ចេកវិទ្យា & IT">បច្ចេកវិទ្យា & IT</option>
                    <option value="រចនា & Design">រចនា & Design</option>
                    <option value="ទីផ្សារ & Marketing">ទីផ្សារ & Marketing</option>
                    <option value="គណនេយ្យ & Finance">គណនេយ្យ & Finance</option>
                    <option value="គ្រប់គ្រងទូទៅ / PMO">គ្រប់គ្រងទូទៅ / PMO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    តួនាទី (Role)
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="member">សមាជិក / បុគ្គលិក (Team Member)</option>
                    <option value="viewer">អ្នកមើល / ភ្ញៀវ (Viewer)</option>
                    <option value="manager">អ្នកចាត់ការទូទៅ (Project Manager)</option>
                    <option value="admin">អ្នកគ្រប់គ្រងជាន់ខ្ពស់ (Super Admin)</option>
                  </select>
                </div>
              </div>

              {/* Role Scope preview hint */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-indigo-950">សិទ្ធិរបស់តួនាទីនេះ ({newRole})៖</p>
                  <p className="text-[11px] text-indigo-800 mt-0.5">
                    {newRole === 'admin'
                      ? 'អាចគ្រប់គ្រងកិច្ចការទាំងអស់, ចាត់ចែងសមាជិក, កែប្រែសិទ្ធិ RBAC និងធ្វើសមកាលកម្ម Cloud DB។'
                      : newRole === 'manager'
                      ? 'អាចមើល និងចាត់តាំងកិច្ចការក្រុម, បង្កើតកិច្ចការ និងតាមដានវឌ្ឍនភាពក្រុម។'
                      : newRole === 'member'
                      ? 'មើលឃើញតែកិច្ចការផ្ទាល់ខ្លួន (Personal Tasks), បង្កើត/កែប្រែកិច្ចការខ្លួនឯង (មិនឃើញ Cloud DB ឬអ្នកដទៃ)។'
                      : 'អាចមើលកិច្ចការផ្ទាល់ខ្លួនប៉ុណ្ណោះ (Read-Only Mode)។'}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>បង្កើតគណនី & ចូលភ្លាមៗ (Create & Sign In)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
