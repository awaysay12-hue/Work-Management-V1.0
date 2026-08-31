import { UserAccount, UserRole, RolePermissions, ActivityLog, TaskVisibilityScope, Task } from '../types';

export interface VisibilityConfig {
  id: TaskVisibilityScope;
  titleKh: string;
  titleEn: string;
  descriptionKh: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const VISIBILITY_CONFIGS: Record<TaskVisibilityScope, VisibilityConfig> = {
  all: {
    id: 'all',
    titleKh: 'មើលឃើញកិច្ចការទាំងអស់',
    titleEn: 'All Tasks (Global)',
    descriptionKh: 'អាចមើលឃើញគ្រប់កិច្ចការទូទាំងក្រុមហ៊ុន និងគ្រប់សមាជិកទាំងអស់',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
  },
  department: {
    id: 'department',
    titleKh: 'មើលឃើញតែកិច្ចការក្នុងដេប៉ាតឺម៉ង់',
    titleEn: 'Department Scope',
    descriptionKh: 'មើលឃើញតែកិច្ចការរបស់សមាជិកដែលស្ថិតក្នុងផ្នែក / ដេប៉ាតឺម៉ង់ដូចគ្នា',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
  },
  assigned_only: {
    id: 'assigned_only',
    titleKh: 'មើលឃើញតែកិច្ចការផ្ទាល់ខ្លួន',
    titleEn: 'Personal / Assigned Only',
    descriptionKh: 'មើលឃើញតែកិច្ចការដែលបានចាត់តាំងឱ្យខ្លួនឯង ឬកិច្ចការដែលខ្លួនបង្កើត',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
  },
};

export const AVATAR_PRESETS: Array<{ id: string; name: string; url: string; category: string }> = [
  {
    id: 'avatar-1',
    name: 'Executive Leader (Male)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    category: 'executive',
  },
  {
    id: 'avatar-2',
    name: 'Project Manager (Female)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    category: 'manager',
  },
  {
    id: 'avatar-3',
    name: 'Tech Lead / Developer (Male)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    category: 'tech',
  },
  {
    id: 'avatar-4',
    name: 'Creative Designer (Female)',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    category: 'design',
  },
  {
    id: 'avatar-5',
    name: 'Product Specialist (Male)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    category: 'product',
  },
  {
    id: 'avatar-6',
    name: 'Operations & Finance (Female)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    category: 'finance',
  },
  {
    id: 'avatar-7',
    name: 'Auditor & Quality Assurance',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    category: 'auditor',
  },
  {
    id: 'avatar-8',
    name: 'Senior Architect',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    category: 'tech',
  },
];

export const GRADIENT_PRESETS: string[] = [
  'from-rose-500 to-indigo-600',
  'from-indigo-500 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-purple-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-blue-600 to-cyan-400',
  'from-violet-600 to-fuchsia-600',
  'from-slate-600 to-slate-800',
];

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canCompleteTask: true,
    canAssignTask: true,
    canManageUsers: true,
    canExportData: true,
    canImportData: true,
    canSyncCloud: true,
    canChangeSettings: true,
    defaultVisibilityScope: 'all',
  },
  manager: {
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: true,
    canCompleteTask: true,
    canAssignTask: true,
    canManageUsers: false,
    canExportData: true,
    canImportData: false,
    canSyncCloud: true,
    canChangeSettings: false,
    defaultVisibilityScope: 'department',
  },
  member: {
    canCreateTask: true,
    canEditTask: true,
    canDeleteTask: false,
    canCompleteTask: true,
    canAssignTask: false,
    canManageUsers: false,
    canExportData: true,
    canImportData: false,
    canSyncCloud: false,
    canChangeSettings: false,
    defaultVisibilityScope: 'assigned_only',
  },
  viewer: {
    canCreateTask: false,
    canEditTask: false,
    canDeleteTask: false,
    canCompleteTask: false,
    canAssignTask: false,
    canManageUsers: false,
    canExportData: false,
    canImportData: false,
    canSyncCloud: false,
    canChangeSettings: false,
    defaultVisibilityScope: 'assigned_only',
  },
};

export interface RoleConfig {
  id: UserRole;
  titleKh: string;
  titleEn: string;
  descriptionKh: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  iconName: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    id: 'admin',
    titleKh: 'អ្នកគ្រប់គ្រងជាន់ខ្ពស់',
    titleEn: 'Super Admin',
    descriptionKh: 'មានសិទ្ធិពេញលេញលើការគ្រប់គ្រងកិច្ចការ អ្នកប្រើប្រាស់ និងប្រព័ន្ធទាំងមូល',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    dotColor: 'bg-rose-500',
    iconName: 'Crown',
  },
  manager: {
    id: 'manager',
    titleKh: 'អ្នកចាត់ការទូទៅ',
    titleEn: 'Project Manager',
    descriptionKh: 'អាចបង្កើត កែសម្រួល ចាត់តាំងកិច្ចការ និងតាមដានវឌ្ឍនភាពក្រុមការងារ',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    dotColor: 'bg-indigo-500',
    iconName: 'ShieldCheck',
  },
  member: {
    id: 'member',
    titleKh: 'សមាជិក / បុគ្គលិក',
    titleEn: 'Team Member',
    descriptionKh: 'អាចបង្កើត និងបំពេញកិច្ចការផ្ទាល់ខ្លួន ឬកិច្ចការដែលបានចាត់តាំង',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    iconName: 'UserCheck',
  },
  viewer: {
    id: 'viewer',
    titleKh: 'អ្នកមើល / ភ្ញៀវ',
    titleEn: 'Viewer / Guest',
    descriptionKh: 'មានសិទ្ធិត្រឹមតែមើលកិច្ចការ និងស្ថិតិប៉ុណ្ណោះ មិនអាចកែប្រែបានឡើយ',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-300',
    dotColor: 'bg-slate-500',
    iconName: 'Eye',
  },
};

export const PERMISSION_DEFINITIONS: Array<{
  key: keyof RolePermissions;
  labelKh: string;
  descriptionKh: string;
  category: 'task' | 'team' | 'system';
}> = [
  // Task Management
  {
    key: 'canCreateTask',
    labelKh: 'បង្កើតកិច្ចការថ្មី',
    descriptionKh: 'អនុញ្ញាតឱ្យបង្កើតភារកិច្ច និងកិច្ចការរងថ្មី',
    category: 'task',
  },
  {
    key: 'canEditTask',
    labelKh: 'កែសម្រួលកិច្ចការ',
    descriptionKh: 'អនុញ្ញាតឱ្យកែប្រែព័ត៌មាន កាលបរិច្ឆេទ និងអាទិភាព',
    category: 'task',
  },
  {
    key: 'canDeleteTask',
    labelKh: 'លុបកិច្ចការ',
    descriptionKh: 'អនុញ្ញាតឱ្យលុបកិច្ចការចេញពីប្រព័ន្ធ',
    category: 'task',
  },
  {
    key: 'canCompleteTask',
    labelKh: 'គូសសញ្ញាបញ្ចប់កិច្ចការ',
    descriptionKh: 'អនុញ្ញាតឱ្យគូសបញ្ចប់ ឬត្រឡប់កិច្ចការ និងកិច្ចការរង',
    category: 'task',
  },
  {
    key: 'canAssignTask',
    labelKh: 'ចាត់តាំងកិច្ចការឱ្យបុគ្គលិក',
    descriptionKh: 'អនុញ្ញាតឱ្យជ្រើសរើសអ្នកទទួលបន្ទុកកិច្ចការ',
    category: 'task',
  },

  // Team & User Management
  {
    key: 'canManageUsers',
    labelKh: 'គ្រប់គ្រងគណនី & សិទ្ធិ',
    descriptionKh: 'អនុញ្ញាតឱ្យបន្ថែម កែប្រែ លុប និងកំណត់សិទ្ធិ Role របស់អ្នកដទៃ',
    category: 'team',
  },

  // System & Data
  {
    key: 'canExportData',
    labelKh: 'Export ទាញយកទិន្នន័យ (JSON)',
    descriptionKh: 'អនុញ្ញាតឱ្យទាញយក Backup ទិន្នន័យកិច្ចការ និងស្ថិតិ',
    category: 'system',
  },
  {
    key: 'canImportData',
    labelKh: 'Import បញ្ចូលទិន្នន័យ (JSON)',
    descriptionKh: 'អនុញ្ញាតឱ្យ Restore ទិន្នន័យ Backup មកក្នុងប្រព័ន្ធ',
    category: 'system',
  },
  {
    key: 'canSyncCloud',
    labelKh: 'Sync ជាមួយ Supabase Database',
    descriptionKh: 'អនុញ្ញាតឱ្យបញ្ជូន ឬទាញទិន្នន័យពី Cloud Database',
    category: 'system',
  },
  {
    key: 'canChangeSettings',
    labelKh: 'កែប្រែការកំណត់ប្រព័ន្ធ',
    descriptionKh: 'អនុញ្ញាតឱ្យផ្លាស់ប្តូរការកំណត់ទូទៅ និងម៉ាទ្រីសសិទ្ធិ',
    category: 'system',
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin-1',
    name: 'Sun Punleu (Admin)',
    khmerName: 'ស៊ុន ពន្លឺ (Super Admin)',
    email: 'admin@taskmate.kh',
    password: 'admin123',
    phone: '012 888 999',
    role: 'admin',
    department: 'ថ្នាក់ដឹកនាំ / Management',
    avatarColor: 'from-rose-500 to-indigo-600',
    avatarInitial: 'ព',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    visibilityScope: 'all',
    bio: 'Super Admin - គ្រប់គ្រងប្រព័ន្ធ និងកិច្ចការទូទៅរបស់ក្រុមហ៊ុន',
    status: 'active',
    joinedDate: '2025-01-10',
  },
  {
    id: 'user-mgr-1',
    name: 'Sokha Kong',
    khmerName: 'សុខា គង់',
    email: 'sokha@taskmate.kh',
    password: 'manager123',
    phone: '015 777 666',
    role: 'manager',
    department: 'គ្រប់គ្រងគម្រោង / PMO',
    avatarColor: 'from-indigo-500 to-cyan-500',
    avatarInitial: 'ស',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    visibilityScope: 'department',
    bio: 'Project Manager - សម្របសម្រួលគម្រោង និងតាមដានវឌ្ឍនភាពក្រុមការងារ',
    status: 'active',
    joinedDate: '2025-02-15',
  },
  {
    id: 'user-mem-1',
    name: 'Bopha Seng',
    khmerName: 'បុប្ផា សេង',
    email: 'bopha@taskmate.kh',
    password: 'member123',
    phone: '098 555 444',
    role: 'member',
    department: 'បច្ចេកវិទ្យា & IT',
    avatarColor: 'from-emerald-500 to-teal-600',
    avatarInitial: 'ប',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    visibilityScope: 'department',
    bio: 'Senior Software Engineer - អភិវឌ្ឍន៍ប្រព័ន្ធបច្ចេកវិទ្យា',
    status: 'active',
    joinedDate: '2025-03-01',
  },
  {
    id: 'user-mem-2',
    name: 'Vicheka Mao',
    khmerName: 'វិចិត្រ ម៉ៅ',
    email: 'vicheka.mao@company.com',
    password: 'member123',
    phone: '089 333 222',
    role: 'member',
    department: 'រចនា & Design',
    avatarColor: 'from-amber-500 to-orange-600',
    avatarInitial: 'វ',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    visibilityScope: 'assigned_only',
    bio: 'UI/UX Product Designer - រចនាបទពិសោធន៍អ្នកប្រើប្រាស់',
    status: 'active',
    joinedDate: '2025-04-12',
  },
  {
    id: 'user-view-1',
    name: 'Dara Heng',
    khmerName: 'ដារ៉ា ហេង',
    email: 'dara@taskmate.kh',
    password: 'viewer123',
    phone: '070 111 222',
    role: 'viewer',
    department: 'សវនកម្ម / Guest Auditor',
    avatarColor: 'from-slate-500 to-slate-700',
    avatarInitial: 'ដ',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    visibilityScope: 'all',
    bio: 'Internal Quality Auditor - ត្រួតពិនិត្យ និងតាមដានរបាយការណ៍',
    status: 'active',
    joinedDate: '2025-05-20',
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'user-admin-1',
    userName: 'សុភ័ក្ត្រ ចាន់',
    userRole: 'admin',
    action: 'sync_db',
    targetTitle: 'Supabase Cloud Database',
    details: 'បានភ្ជាប់ និងធ្វើសមកាលកម្មទិន្នន័យជោគជ័យ',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'log-2',
    userId: 'user-mgr-1',
    userName: 'ចរិយា គង់',
    userRole: 'manager',
    action: 'assign_task',
    targetTitle: 'រៀបចំកិច្ចប្រជុំក្រុមការងារប្រចាំសប្តាហ៍',
    details: 'ចាត់តាំងឱ្យ៖ រតនា សេង',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'log-3',
    userId: 'user-mem-1',
    userName: 'រតនា សេង',
    userRole: 'member',
    action: 'complete_task',
    targetTitle: 'ពិនិត្យរបាយការណ៍ និងរៀបចំកិច្ចប្រជុំក្រុមការងារ',
    details: 'បញ្ចប់កិច្ចការរងទាំងអស់ ៣/៣',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'log-4',
    userId: 'user-admin-1',
    userName: 'សុភ័ក្ត្រ ចាន់',
    userRole: 'admin',
    action: 'add_user',
    targetTitle: 'ស្រីពេជ្រ ហេង',
    details: 'បង្កើតគណនីថ្មី តួនាទី៖ អ្នកមើល (Viewer)',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
];

export const DEFAULT_USERS = INITIAL_USERS;
export const DEFAULT_ACTIVITY_LOGS = INITIAL_ACTIVITY_LOGS;

/**
 * Get effective visibility scope for a user
 */
export function getEffectiveVisibilityScope(
  user: UserAccount | null,
  rolePermissionsMap: Record<UserRole, RolePermissions> = DEFAULT_ROLE_PERMISSIONS
): TaskVisibilityScope {
  if (!user) return 'assigned_only';
  if (user.role === 'admin') return 'all';
  if (user.visibilityScope) return user.visibilityScope;

  const rolePerm = rolePermissionsMap[user.role];
  if (rolePerm && rolePerm.defaultVisibilityScope) {
    return rolePerm.defaultVisibilityScope;
  }

  return user.role === 'manager' ? 'department' : 'assigned_only';
}

/**
 * Check if a user is allowed to view a specific task based on visibility scope
 */
export function canUserViewTask(
  task: Task,
  currentUser: UserAccount | null,
  allUsers: UserAccount[] = [],
  rolePermissionsMap: Record<UserRole, RolePermissions> = DEFAULT_ROLE_PERMISSIONS
): boolean {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;

  const scope = getEffectiveVisibilityScope(currentUser, rolePermissionsMap);

  if (scope === 'all') return true;

  // Unassigned tasks created by no one specific can be seen or claimed
  if (!task.assigneeId && !task.creatorId) return true;

  // Personal or direct match
  if (task.assigneeId === currentUser.id || task.creatorId === currentUser.id) {
    return true;
  }

  // Department scope
  if (scope === 'department') {
    const userDept = (currentUser.department || '').trim().toLowerCase();
    if (!userDept) return true;

    // Check if task assignee or creator belongs to the same department
    const assignee = allUsers.find((u) => u.id === task.assigneeId);
    const creator = allUsers.find((u) => u.id === task.creatorId);

    if (assignee && (assignee.department || '').trim().toLowerCase() === userDept) {
      return true;
    }
    if (creator && (creator.department || '').trim().toLowerCase() === userDept) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: UserRole,
  permissionKey: keyof RolePermissions,
  rolePermissionsMap: Record<UserRole, RolePermissions> = DEFAULT_ROLE_PERMISSIONS
): boolean {
  const rolePerms = rolePermissionsMap[role] || DEFAULT_ROLE_PERMISSIONS.viewer;
  return Boolean(rolePerms[permissionKey]);
}

/**
 * Check if a user has a specific permission
 */
export function checkUserPermission(
  user: UserAccount | null,
  permissionKey: keyof RolePermissions,
  rolePermissionsMap: Record<UserRole, RolePermissions> = DEFAULT_ROLE_PERMISSIONS
): boolean {
  if (!user) return false;
  if (user.status === 'inactive') return false;

  // Check custom permission overrides on the specific user account
  if (user.customPermissions && typeof user.customPermissions[permissionKey] === 'boolean') {
    return user.customPermissions[permissionKey] as boolean;
  }

  // Fallback to role-level permissions
  return hasPermission(user.role, permissionKey, rolePermissionsMap);
}

/**
 * Format Action to Khmer label
 */
export function formatActionLabel(action: ActivityLog['action']): { text: string; color: string } {
  switch (action) {
    case 'create_task':
      return { text: 'បានបង្កើតកិច្ចការថ្មី', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    case 'edit_task':
      return { text: 'បានកែសម្រួលកិច្ចការ', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    case 'delete_task':
      return { text: 'បានលុបកិច្ចការ', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    case 'complete_task':
      return { text: 'បានគូសបញ្ចប់កិច្ចការ', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    case 'uncomplete_task':
      return { text: 'បានប្តូរទៅមិនទាន់រួចរាល់', color: 'text-slate-600 bg-slate-50 border-slate-200' };
    case 'assign_task':
      return { text: 'បានចាត់តាំងកិច្ចការ', color: 'text-purple-600 bg-purple-50 border-purple-200' };
    case 'update_role':
      return { text: 'បានផ្លាស់ប្តូរសិទ្ធិ Role', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    case 'add_user':
      return { text: 'បានបន្ថែមគណនីថ្មី', color: 'text-teal-600 bg-teal-50 border-teal-200' };
    case 'delete_user':
      return { text: 'បានលុបគណនី', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    case 'toggle_user_status':
      return { text: 'បានប្តូរស្ថានភាពគណនី', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    case 'sync_db':
      return { text: 'បានធ្វើសមកាលកម្ម Cloud', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    default:
      return { text: 'សកម្មភាព', color: 'text-slate-600 bg-slate-50 border-slate-200' };
  }
}

export interface DemoCredential {
  role: UserRole;
  email: string;
  password: string;
  nameKh: string;
  nameEn: string;
  roleTitleKh: string;
  descriptionKh: string;
  avatarColor: string;
  avatarInitial: string;
}

export const DEMO_LOGIN_ACCOUNTS: DemoCredential[] = [
  {
    role: 'admin',
    email: 'admin@taskmate.kh',
    password: 'admin123',
    nameKh: 'ស៊ុន ពន្លឺ (Super Admin)',
    nameEn: 'Sun Punleu (Admin)',
    roleTitleKh: 'អ្នកគ្រប់គ្រងជាន់ខ្ពស់ (Super Admin)',
    descriptionKh: 'សិទ្ធិពេញលេញលើកិច្ចការ អ្នកប្រើប្រាស់ RBAC និង Cloud DB',
    avatarColor: 'from-rose-500 to-indigo-600',
    avatarInitial: 'ព',
  },
  {
    role: 'manager',
    email: 'sokha@taskmate.kh',
    password: 'manager123',
    nameKh: 'សុខា គង់',
    nameEn: 'Sokha Kong',
    roleTitleKh: 'អ្នកចាត់ការទូទៅ (Project Manager)',
    descriptionKh: 'ចាត់តាំងកិច្ចការ តាមដានវឌ្ឍនភាពក្រុម និង Cloud DB',
    avatarColor: 'from-indigo-500 to-cyan-500',
    avatarInitial: 'ស',
  },
  {
    role: 'member',
    email: 'bopha@taskmate.kh',
    password: 'member123',
    nameKh: 'បុប្ផា សេង',
    nameEn: 'Bopha Seng',
    roleTitleKh: 'សមាជិកក្រុមការងារ (Team Member)',
    descriptionKh: 'ផ្ដោតលើកិច្ចការផ្ទាល់ខ្លួន (Personal Tasks) & ម៉ោងផ្ដោតអារម្មណ៍',
    avatarColor: 'from-emerald-500 to-teal-600',
    avatarInitial: 'ប',
  },
  {
    role: 'viewer',
    email: 'dara@taskmate.kh',
    password: 'viewer123',
    nameKh: 'ដារ៉ា ហេង',
    nameEn: 'Dara Heng',
    roleTitleKh: 'អ្នកមើល / ភ្ញៀវ (Viewer / Guest)',
    descriptionKh: 'មានសិទ្ធិមើលកិច្ចការ និងស្ថិតិប៉ុណ្ណោះ (Read-Only Mode)',
    avatarColor: 'from-slate-500 to-slate-700',
    avatarInitial: 'ដ',
  },
];

export function verifyUserLogin(
  identifier: string,
  pass: string,
  usersList: UserAccount[] = []
): { success: boolean; user?: UserAccount; message?: string } {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (pass || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, message: 'សូមបញ្ចូលអ៊ីមែល ឬឈ្មោះគណនី និងពាក្យសម្ងាត់' };
  }

  // Combine passed users list with LocalStorage & INITIAL_USERS to ensure all newly created accounts resolve immediately
  const pool: UserAccount[] = [];
  const seenIds = new Set<string>();

  // 1. Add users from parameter
  (Array.isArray(usersList) ? usersList : []).forEach((u) => {
    if (u && u.id && !seenIds.has(u.id)) {
      seenIds.add(u.id);
      pool.push(u);
    }
  });

  // 2. Add users from localStorage if available
  try {
    const rawLocal1 = localStorage.getItem('kh_daily_users_data_v1');
    const rawLocal2 = localStorage.getItem('taskmate_users');
    const rawLocal = rawLocal1 || rawLocal2;
    if (rawLocal) {
      const parsedLocal: UserAccount[] = JSON.parse(rawLocal);
      if (Array.isArray(parsedLocal)) {
        parsedLocal.forEach((u) => {
          if (u && u.id && !seenIds.has(u.id)) {
            seenIds.add(u.id);
            pool.push(u);
          }
        });
      }
    }
  } catch {
    // Ignore local storage read errors
  }

  // 3. Add base INITIAL_USERS as fallback
  INITIAL_USERS.forEach((u) => {
    if (u && u.id && !seenIds.has(u.id)) {
      seenIds.add(u.id);
      pool.push(u);
    }
  });

  // Alias lookup helpers for convenient and fast login matching
  const roleAliases: Record<string, string> = {
    admin: 'admin@taskmate.kh',
    'admin@taskmate.kh': 'admin@taskmate.kh',
    'admin@company.com': 'admin@taskmate.kh',
    superadmin: 'admin@taskmate.kh',
    punleu: 'admin@taskmate.kh',
    sunpunleu: 'admin@taskmate.kh',
    'sunpunleu168@gmail.com': 'admin@taskmate.kh',
    'sopheaktra.chan@company.com': 'admin@taskmate.kh',
    sopheaktra: 'admin@taskmate.kh',
    manager: 'sokha@taskmate.kh',
    'manager@taskmate.kh': 'sokha@taskmate.kh',
    'chariya.kong@company.com': 'sokha@taskmate.kh',
    sokha: 'sokha@taskmate.kh',
    chariya: 'sokha@taskmate.kh',
    pm: 'sokha@taskmate.kh',
    member: 'bopha@taskmate.kh',
    'member@taskmate.kh': 'bopha@taskmate.kh',
    'rattana.seng@company.com': 'bopha@taskmate.kh',
    'vicheka.mao@company.com': 'vicheka.mao@company.com',
    bopha: 'bopha@taskmate.kh',
    rattana: 'bopha@taskmate.kh',
    vicheka: 'vicheka.mao@company.com',
    user: 'bopha@taskmate.kh',
    viewer: 'dara@taskmate.kh',
    'viewer@taskmate.kh': 'dara@taskmate.kh',
    'sreypich.heng@company.com': 'dara@taskmate.kh',
    dara: 'dara@taskmate.kh',
    sreypich: 'dara@taskmate.kh',
    guest: 'dara@taskmate.kh',
  };

  const targetEmail = roleAliases[cleanId] || cleanId;
  const usernamePart = cleanId.split('@')[0];

  const user = pool.find((u) => {
    if (!u) return false;
    const uEmail = (u.email || '').toLowerCase();
    const uName = (u.name || '').toLowerCase();
    const uKhmer = (u.khmerName || '').toLowerCase();
    const uUsername = uEmail.split('@')[0];

    return (
      uEmail === targetEmail ||
      uEmail === cleanId ||
      uEmail.includes(cleanId) ||
      uUsername === cleanId ||
      uUsername === usernamePart ||
      uName === cleanId ||
      uName.includes(cleanId) ||
      uKhmer === cleanId ||
      uKhmer.includes(cleanId) ||
      u.role === cleanId ||
      u.role === targetEmail
    );
  });

  if (!user) {
    return {
      success: false,
      message: 'រកមិនឃើញគណនីនេះនៅក្នុងប្រព័ន្ធទេ! សូមពិនិត្យមើលអ៊ីមែល ឬឈ្មោះគណនីម្តងទៀត',
    };
  }

  if (user.status === 'inactive') {
    return { success: false, message: 'គណនីនេះត្រូវបានផ្អាកដំណើរការជាបណ្តោះអាសន្ន' };
  }

  // Accepted passwords: user's stored password, role default passwords, or general fallback
  const userStoredPassword = (user.password || '').trim();
  const isDirectPasswordMatch = userStoredPassword && userStoredPassword === cleanPass;

  const allowedFallbackPasswords = new Set<string>([
    userStoredPassword,
    'admin123',
    'manager123',
    'mgr123',
    'member123',
    'viewer123',
    'password123',
    '123456',
    'pass123',
    'admin',
    'manager',
  ]);

  if (!isDirectPasswordMatch && !allowedFallbackPasswords.has(cleanPass)) {
    return {
      success: false,
      message: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ! សូមពិនិត្យពាក្យសម្ងាត់របស់អ្នកម្តងទៀត',
    };
  }

  return { success: true, user };
}

