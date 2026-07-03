'use client';

import React from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
}

interface PermissionAuditChecklistProps {
  items: ChecklistItem[];
  onToggle?: (id: string, checked: boolean) => void;
  className?: string;
}

/**
 * Reusable permission audit checklist component.
 * Useful for systematic security reviews of permission structures.
 */
export function PermissionAuditChecklist({ items, onToggle, className = '' }: PermissionAuditChecklistProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Audit Checklist</h3>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={item.checked || false}
                onChange={(e) => onToggle?.(item.id, e.target.checked)}
                className="mt-1 accent-emerald-500"
              />
              <div>
                <div className="font-medium text-sm">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No checklist items.</p>
        )}
      </div>
    </div>
  );
}
