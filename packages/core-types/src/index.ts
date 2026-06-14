/**
 * Core Types - Platform-wide type definitions
 * 
 * @package @balloo/core-types
 * @version 1.0.0
 * @date 2026-06-14
 * 
 * [CODEGEN] Generated from MODULE_CONTRACT_core-types.md
 * 
 * Migration Status:
 * - Phase 3: Core types extracted from shared/
 * - Backward compatibility maintained in shared/
 * - Legacy apps still use @balloo/shared
 * 
 * Type Categories:
 * - Common (ID, Timestamp, Status)
 * - User (User, User preferences)
 * - Chat (Chat, ChatMember)
 * - Message (Message, MessageSummary, Reaction)
 * - Node (NodeConfig, NodeState, NodeTree)
 * - Invitation (Invitation)
 * - Notification (Notification)
 * - Feature (Feature voting)
 * - Page (Page, PageSection)
 * - Report (Report moderation)
 * - Auth (AuthCredentials, AuthTokens, AuthResponse)
 * - API (ApiResponse, PaginatedResponse)
 * - Platform (Platform, OS, AppConfig)
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Unique identifier across the platform
 * @format UUID or similar unique string
 */
export type ID = string;

/**
 * Unix timestamp in milliseconds
 * @example 1718409600000
 */
export type Timestamp = number;

/**
 * Generic status type for entities
 */
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

/**
 * Generic result type for operations
 */
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// NODE TYPES (from NodeTreeContract, NodeRolesContract)
// ============================================================================

/**
 * Node type in the Balloo topology
 */
export type NodeType = 
  | 'laptop'      // laptop_control - development, docs
  | 'server'      // work_server - production deployment
  | 'nas'         // home_nas - storage
  | 'aio';        // home_aio - all-in-one

/**
 * Node role for access control
 */
export type NodeRole = 
  | 'development'   // Development environment
  | 'production'    // Production deployment
  | 'storage'       // Storage node
  | 'admin'         // Administrative access
  | 'backup';       // Backup node

/**
 * Node deployment target
 */
export type NodeDeploymentTarget = 
  | 'local'         // Local development
  | 'vps'           // Virtual private server
  | 'on-premise'    // On-premise hardware
  | 'container';    // Container orchestration

/**
 * Node configuration from NodeTreeContract
 */
export interface NodeConfig {
  /** Unique node identifier */
  nodeId: ID;
  
  /** Human-readable node name */
  nodeName: string;
  
  /** Node type in topology */
  nodeType: NodeType;
  
  /** Node roles */
  roles: NodeRole[];
  
  /** Deployment target */
  deploymentTarget: NodeDeploymentTarget;
  
  /** Network configuration */
  networking: {
    /** Primary IP address */
    primaryIp: string;
    /** Tailscale IP (if applicable) */
    tailscaleIp?: string;
    /** SSH port */
    sshPort: number;
    /** HTTP/HTTPS ports */
    ports: {
      http: number;
      https: number;
    };
  };
  
  /** Domain bindings */
  domains: {
    /** Primary domain */
    primary?: string;
    /** Subdomains */
    subdomains: string[];
  };
  
  /** Services deployed on this node */
  services: string[];
  
  /** Recovery priority (lower = higher priority) */
  recoveryPriority: number;
  
  /** Node enabled status */
  enabled: boolean;
  
  /** Configuration metadata */
  metadata: {
    /** When node was added */
    createdAt: Timestamp;
    /** Last configuration update */
    updatedAt: Timestamp;
    /** Configuration version */
    version: string;
  };
}

/**
 * Node runtime state
 */
export interface NodeState {
  /** Node identifier */
  nodeId: ID;
  
  /** Current status */
  status: Status;
  
  /** When node was last seen/checked */
  lastSeen: Timestamp;
  
  /** Uptime in seconds */
  uptimeSeconds?: number;
  
  /** Health check status */
  health: {
    /** Overall health status */
    status: 'healthy' | 'degraded' | 'unhealthy';
    /** Last health check timestamp */
    lastCheck: Timestamp;
    /** Health check errors */
    errors: string[];
  };
  
  /** Resource utilization */
  resources?: {
    /** CPU usage percentage */
    cpu: number;
    /** Memory usage percentage */
    memory: number;
    /** Disk usage percentage */
    disk: number;
  };
  
  /** Active services */
  activeServices: string[];
  
  /** State metadata */
  metadata: {
    /** When state was recorded */
    recordedAt: Timestamp;
    /** State version */
    version: string;
  };
}

/**
 * Node tree structure
 */
export interface NodeTree {
  /** Root node ID */
  rootId: ID;
  
  /** All nodes in tree */
  nodes: Record<ID, NodeConfig>;
  
  /** Node parent relationships */
  parentMap: Record<ID, ID | null>;
  
  /** Node children relationships */
  childrenMap: Record<ID, ID[]>;
  
  /** Tree metadata */
  metadata: {
    /** When tree was built */
    builtAt: Timestamp;
    /** Tree version */
    version: string;
  };
}

// ============================================================================
// USER TYPES
// ============================================================================

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  fullName?: string;
  birthDate?: number;
  isAdmin: boolean;
  isSuperAdmin?: boolean;
  adminRoles?: string[];
  adminSince?: number;
  publicKey?: string;
  createdAt: number;
  lastSeen?: number;
  isOnline?: boolean;
  status?: string;
  updatedAt: number;
}

// ============================================================================
// Chat Types
// ============================================================================

export interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  avatar?: string;
  participants: string[];
  members: Record<string, ChatMember>;
  adminIds: string[];
  createdBy: string;
  description?: string;
  isFavorite?: Record<string, boolean>;
  pinned?: Record<string, boolean>;
  unreadCount?: Record<string, number>;
  lastMessage?: MessageSummary;
  createdAt: number;
  updatedAt: number;
  isSystemChat?: boolean;
}

export interface ChatMember {
  role: 'owner' | 'admin' | 'member';
  joinedAt: number;
  lastReadMessageId?: string;
}

// ============================================================================
// Message Types
// ============================================================================

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'image' | 'video' | 'file' | 'audio';
  content: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  replyToId?: string;
  replyToMessage?: Message;
  reactions?: Record<string, Reaction>;
  readBy: string[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  edited: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MessageSummary {
  id: string;
  content: string;
  type: string;
  senderId: string;
  createdAt: number;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
  count: number;
}

// ============================================================================
// Invitation Types
// ============================================================================

export interface Invitation {
  id: string;
  code: string;
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  isPermanent: boolean;
  maxUses?: number;
  usedCount: number;
  usedBy: string[];
  groupIds: string[];
  pointsReward: number;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  timestamp: number;
  isRead: boolean;
}

// ============================================================================
// Feature Types
// ============================================================================

export interface Feature {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'ui' | 'security' | 'performance';
  status: 'pending' | 'planned' | 'in-progress' | 'completed' | 'rejected';
  votes: number;
  votedBy: string[];
  createdBy: string;
  createdByName: string;
  adminNote?: string;
  plannedAt?: number;
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// Page Types
// ============================================================================

export interface Page {
  id: string;
  title: string;
  content: string;
  sections?: PageSection[];
  metadata?: Record<string, any>;
  isActive: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface PageSection {
  id: string;
  type: 'payment' | 'qr' | 'text' | 'person' | 'features';
  title?: string;
  content?: string;
  data?: Record<string, any>;
}

// ============================================================================
// Report Types
// ============================================================================

export interface Report {
  id: string;
  targetType: 'user' | 'chat' | 'message' | 'contact';
  targetId: string;
  reportedBy: string;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'fake' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// PLATFORM TYPES
// ============================================================================

/**
 * Client platform type
 */
export type Platform = 'web' | 'mobile' | 'desktop' | 'android-service';

/**
 * Operating system type
 */
export type OS = 'windows' | 'macos' | 'linux' | 'android' | 'ios';

// ============================================================================
// CONFIG TYPES
// ============================================================================

/**
 * Application configuration
 */
export interface AppConfig {
  /** Application name */
  name: string;
  
  /** Application version (semver) */
  version: string;
  
  /** Client platform */
  platform: Platform;
  
  /** Operating system (optional) */
  os?: OS;
  
  /** API server URL */
  apiUrl: string;
  
  /** Push notifications enabled */
  pushEnabled: boolean;
  
  /** Feature flags */
  featureFlags?: Record<string, boolean>;
  
  /** Configuration metadata */
  metadata?: {
    /** When config was created */
    createdAt: Timestamp;
    /** Last update */
    updatedAt: Timestamp;
  };
}

// ============================================================================
// ADMIN TYPES (from Admin Portal requirements)
// ============================================================================

/**
 * Admin user role
 */
export type AdminRole = 
  | 'super_admin'    // Full system access
  | 'admin'          // Standard admin access
  | 'operator'       // Operational tasks only
  | 'viewer'         // Read-only access
  | 'moderator';     // Content moderation

/**
 * Admin permission
 */
export type AdminPermission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'nodes:read'
  | 'nodes:write'
  | 'nodes:delete'
  | 'services:read'
  | 'services:write'
  | 'services:delete'
  | 'config:read'
  | 'config:write'
  | 'logs:read'
  | 'logs:delete'
  | 'reports:read'
  | 'reports:resolve'
  | 'system:restart'
  | 'system:backup'
  | 'system:restore';

/**
 * Admin user profile
 */
export interface AdminUser {
  /** User ID */
  userId: ID;
  
  /** Admin role */
  role: AdminRole;
  
  /** Assigned permissions */
  permissions: AdminPermission[];
  
  /** When admin access was granted */
  adminSince: Timestamp;
  
  /** Who granted admin access */
  grantedBy?: ID;
  
  /** Admin active status */
  isActive: boolean;
  
  /** Last admin action timestamp */
  lastActionAt?: Timestamp;
}

/**
 * Admin audit log entry
 */
export interface AuditLogEntry {
  /** Log entry ID */
  id: ID;
  
  /** Admin user ID */
  adminId: ID;
  
  /** Action performed */
  action: string;
  
  /** Target resource */
  target: {
    /** Resource type */
    type: string;
    /** Resource ID */
    id: ID;
  };
  
  /** Action result */
  result: 'success' | 'failure';
  
  /** Error message (if failed) */
  errorMessage?: string;
  
  /** IP address */
  ipAddress: string;
  
  /** User agent */
  userAgent: string;
  
  /** When action was performed */
  timestamp: Timestamp;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * System metrics
 */
export interface SystemMetrics {
  /** When metrics were collected */
  collectedAt: Timestamp;
  
  /** Time range */
  timeRange: {
    /** Start timestamp */
    start: Timestamp;
    /** End timestamp */
    end: Timestamp;
  };
  
  /** System health */
  health: {
    /** Overall status */
    status: 'healthy' | 'degraded' | 'critical';
    /** Active nodes count */
    activeNodes: number;
    /** Total nodes count */
    totalNodes: number;
  };
  
  /** Performance metrics */
  performance: {
    /** Average response time (ms) */
    avgResponseTime: number;
    /** Requests per second */
    requestsPerSecond: number;
    /** Error rate (percentage) */
    errorRate: number;
  };
  
  /** Resource usage */
  resources: {
    /** Total CPU usage (percentage) */
    cpuUsage: number;
    /** Total memory usage (percentage) */
    memoryUsage: number;
    /** Total disk usage (percentage) */
    diskUsage: number;
  };
  
  /** User metrics */
  users: {
    /** Total users */
    total: number;
    /** Active users (last 24h) */
    active: number;
    /** New users (last 24h) */
    newToday: number;
  };
}

// ============================================================================
// TYPE UTILITIES
// ============================================================================

/**
 * Make all properties in T optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties in T required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Make all properties in T readonly
 */
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * Extract only the keys of the given type T
 */
export type Keys<T> = keyof T;

/**
 * Pick keys from T where the value extends U
 */
export type PickByValue<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

/**
 * Omit keys from T where the value extends U
 */
export type OmitByValue<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Async function type
 */
export type AsyncFunction<T = any> = () => Promise<T>;

// ============================================================================
// TYPE EXPORTS SUMMARY
// ============================================================================

/**
 * All ID types
 */
export type AnyID = 
  | ID
  | UserId
  | ChatId
  | MessageId
  | NodeId;

/**
 * Common ID type aliases for clarity
 */
export type UserId = ID;
export type ChatId = ID;
export type MessageId = ID;
export type NodeId = ID;
export type ConversationId = ID;

// ============================================================================
// MODULE EXPORTS
// ============================================================================

// Export all types for @balloo/core-types package
// This file serves as the main entry point for type imports

/**
 * @package @balloo/core-types
 * @description Central type definitions for Balloo monorepo
 * @see MODULE_CONTRACT_core-types.md for full specification
 * @see MODULE_SUMMARY_core-types.md for human-readable summary
 */
