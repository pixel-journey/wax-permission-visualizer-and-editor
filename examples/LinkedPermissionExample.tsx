'use client';

import React from 'react';

interface LinkedPermission {
  permission: string;
  contract: string;
  action: string;
}

interface LinkedPermissionExampleProps {
  links: LinkedPermission[];
  className?: string;
}

/**
 * Educational component showing linked permission examples.
 * Very useful for smart contract developers.
 */
export function LinkedPermissionExample({ links, className = '' }: LinkedPermissionExampleProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Linked Permission Examples</h3>

      <div className="space-y-3">
        {links.length > 0 ? (
          links.map((link, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3 text-sm">
              <div className="font-medium text-emerald-400">{link.permission}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Contract: <span className="font-mono">{link.contract}</span><br />
                Action: <span className="font-mono">{link.action}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No linked permissions configured.</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Linked permissions allow fine-grained control over which actions can be called with a specific permission.
      </p>
    </div>
  );
}
