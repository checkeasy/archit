// ============================================
// ArchiPro - Type Definitions
// ============================================

export type UserRole = 'admin' | 'architect' | 'collaborator' | 'client';

export type ProjectPhase = 'prospect' | 'esquisse' | 'aps' | 'apd' | 'pro' | 'dce' | 'act' | 'visa' | 'det' | 'aor' | 'reception' | 'delivered';

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

// ============================================
// Database Types
// ============================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  firm_name: string | null;
  phone: string | null;
  address: string | null;
  siret: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  notes: string | null;
  type: 'particulier' | 'professionnel' | 'public';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  reference: string | null;
  client_id: string | null;
  client?: Client;
  status: ProjectStatus;
  phase: ProjectPhase;
  budget: number | null;
  surface_m2: number | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  start_date: string | null;
  end_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectPhaseRecord {
  id: string;
  project_id: string;
  name: string;
  phase_key: ProjectPhase;
  order_index: number;
  status: 'pending' | 'active' | 'completed';
  start_date: string | null;
  end_date: string | null;
  progress: number;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  assignee?: Profile;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  project_id: string | null;
  project?: Project;
  client_id: string;
  client?: Client;
  quote_number: string;
  status: QuoteStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  valid_until: string | null;
  notes: string | null;
  conditions: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  items?: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  description: string;
  phase: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  order_index: number;
}

export interface Invoice {
  id: string;
  quote_id: string | null;
  quote?: Quote;
  project_id: string | null;
  project?: Project;
  client_id: string;
  client?: Client;
  invoice_number: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  amount: number;
  due_date: string | null;
  paid_date: string | null;
  paid_amount: number;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  project_id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploader?: Profile;
  version: number;
  category: 'plan' | 'render' | 'contract' | 'permit' | 'report' | 'photo' | 'other';
  created_at: string;
}

export interface Comment {
  id: string;
  project_id: string | null;
  document_id: string | null;
  user_id: string;
  user?: Profile;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user?: Profile;
  project_id: string | null;
  project?: Project;
  action: string;
  details: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}

// ============================================
// UI Types
// ============================================

export interface KanbanColumn {
  id: ProjectPhase;
  title: string;
  projects: Project[];
}

export interface DashboardStats {
  activeProjects: number;
  totalClients: number;
  pendingInvoices: number;
  pendingAmount: number;
  monthlyRevenue: number;
  upcomingDeadlines: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
