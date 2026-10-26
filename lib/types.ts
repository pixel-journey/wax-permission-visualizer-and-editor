export interface PermissionKey {
  key: string;
  weight: number;
}

export interface PermissionAccount {
  permission: {
    actor: string;
    permission: string;
  };
  weight: number;
}

export interface PermissionNode {
  name: string;
  threshold: number;
  keys: PermissionKey[];
  accounts: PermissionAccount[];
  children?: PermissionNode[];
  parent?: string;
}

export interface LinkedAction {
  account: string;
  action: string;
  permission: string;
}

export interface PermissionGraph {
  account: string;
  permissions: Record<string, PermissionNode>;
  lastUpdated: string;
  onChainHash?: string;
  /** Soft-parsed when RPC returns linked_actions */
  linkedActions?: LinkedAction[];
}

export interface SimulationResult {
  canExecute: boolean;
  currentWeight: number;
  missingWeight: number;
  satisfiedKeys: string[];
  warnings: string[];
  riskLevel: "safe" | "warning" | "danger";
}

export interface ChangeWarning {
  level: "info" | "warning" | "danger";
  message: string;
  affectedPermission?: string;
}
