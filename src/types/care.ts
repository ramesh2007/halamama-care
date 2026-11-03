// ─── SP1-02: TypeScript Domain Models ───────────────────────────────────────
// Core domain types for the Halamama Customer Care Platform.
// These interfaces mirror the backend API contracts and provide
// full type safety across all components.

export type ChannelType = 'whatsapp' | 'instagram' | 'messenger' | 'email';

export type TicketStatus = 'in_progress' | 'pending' | 'follow_up' | 'resolved';

export type DepartmentType = 'general' | 'returns' | 'operations' | 'installation' | 'sales';

export type UserRole = 'agent' | 'operations_manager' | 'admin' | 'warehouse_lead';

export type PresenceStatus = 'online' | 'busy' | 'offline';

export type DeliveryStatus = 'Picked' | 'Packed' | 'In Transit' | 'Out for Delivery' | 'Delivered';

export type ReturnReason = 'damaged' | 'wrong_item' | 'customer_cancellation';

export type ReturnDisposition = 'wallet_credit' | 'replacement' | 'gateway_refund';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assigned_departments: DepartmentType[];
  presence: PresenceStatus;
  avatar_url?: string;
}

export interface CustomerContext {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  wallet_balance_qar: number;
  total_orders: number;
  customer_group: string;
  lifetime_spend?: number;
}

export interface OrderItem {
  item_code: string;
  item_name: string;
  qty: number;
  rate: number;
  amount: number;
  warehouse: string;
  requires_installation: boolean;
}

export interface SalesOrderSummary {
  name: string; // e.g. SO-2026-0881
  creation_date: string;
  grand_total: number;
  fulfillment_status: 'Draft' | 'To Deliver and Bill' | 'Completed';
  delivery_status: DeliveryStatus;
  driver_name?: string;
  driver_phone?: string;
  vehicle_number?: string;
  items: OrderItem[];
}

export interface PaymentLinkMetadata {
  invoice_id: string;
  amount: number;
  url: string;
  status: 'pending' | 'paid';
  expires_at?: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  sender_type: 'customer' | 'agent' | 'bot' | 'internal_note';
  sender_name: string;
  text?: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio' | 'document';
  payment_link_metadata?: PaymentLinkMetadata;
  created_at: string;
  delivery_status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ConversationThread {
  id: string;
  customer_name: string;
  customer_phone: string;
  channel: ChannelType;
  department: DepartmentType;
  status: TicketStatus;
  assigned_agent_id?: string;
  assigned_agent_name?: string;
  last_message_preview: string;
  last_message_at: string;
  last_customer_message_at: string;
  unread_count: number;
  is_bot_active: boolean;
  sla_deadline?: string;
  tags?: string[];
}

export interface ReturnRequestPayload {
  order_id: string;
  customer_phone: string;
  items: { item_code: string; qty: number; rate: number }[];
  total_refund_amount: number;
  reason: ReturnReason;
  disposition: ReturnDisposition;
  notes?: string;
}

export interface ReturnResponse {
  status: 'auto_approved' | 'pending_approval';
  return_request_id: string;
  auto_approved: boolean;
  requires_role?: UserRole;
  message: string;
}

export interface PaymentLinkRequest {
  customer_phone: string;
  customer_name: string;
  order_id: string;
  invoice_amount: number;
  currency: string;
  description: string;
}

export interface PaymentLinkResponse {
  success: boolean;
  payment_id: string;
  invoice_url: string;
  expires_at: string;
}

export interface InstallationSlotRequest {
  order_id: string;
  customer_phone: string;
  delivery_zone: string;
  scheduled_date: string;
  time_slot: string;
  installation_team_id: string;
  driver_id?: string;
}

export interface InstallationSlotResponse {
  success: boolean;
  appointment_id: string;
  status: string;
  assigned_team: string;
  synced_to_erpnext: boolean;
}

export interface EmailTicket {
  id: string;
  ticket_id: string; // e.g. #TCK-1098
  sender_name: string;
  sender_email: string;
  subject: string;
  customer_link?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'pending_ops' | 'escalated' | 'closed';
  created_at: string;
  updated_at: string;
  department?: string;
}

export interface BroadcastCampaign {
  id: string;
  name: string;
  template_name: string;
  audience_size: number;
  delivery_rate: number;
  read_rate: number;
  failed_count: number;
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  scheduled_at?: string;
  sent_at?: string;
}

export interface CannedResponse {
  id: string;
  trigger: string; // e.g. /store_loc
  label: string;
  text: string;
  category: string;
}

export interface StockBalance {
  item_code: string;
  item_name: string;
  warehouses: {
    warehouse_name: string;
    actual_qty: number;
  }[];
}

// Dashboard Metrics
export interface DashboardMetrics {
  active_chats: number;
  sla_breaches: number;
  returns_in_review: number;
  installation_backlog: number;
  unassigned_pool: number;
  first_response_avg_minutes: number;
}

export interface EmailAttachment {
  name: string;
  size: number;
}

export interface EmailMessage {
  id: string;
  ticket_id: string;
  sender_name: string;
  sender_email: string;
  recipients: string[];
  cc?: string[];
  subject: string;
  body_text: string;
  body_html?: string;
  attachments: EmailAttachment[];
  direction: 'inbound' | 'outbound';
  created_at: string;
}

export interface BroadcastTemplate {
  id: string;
  name: string;
  category: string;
  status: 'approved' | 'pending' | 'rejected';
  body: string;
  variables: string[];
}
