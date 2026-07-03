'use client';

import React from 'react';

interface WharfKitIntegrationExampleProps {
  onConnect?: () => void;
  isConnected?: boolean;
  className?: string;
}

/**
 * Example component showing how to integrate with WharfKit.
 * Educational component for developers.
 */
export function WharfKitIntegrationExample({ onConnect, isConnected = false, className = '' }: WharfKitIntegrationExampleProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">WharfKit Integration</h3>

      <p className="text-sm text-muted-foreground mb-4">
        Connect a wallet to preview and execute permission changes on-chain.
      </p>

      <button
        onClick={onConnect}
        disabled={isConnected}
        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl text-sm font-medium"
      >
        {isConnected ? 'Wallet Connected' : 'Connect Wallet (WharfKit)'}
      </button>

      <p className="text-xs text-muted-foreground mt-3">
        This is an educational example. Real implementations should handle sessions, signing, and error states properly.
      </p>
    </div>
  );
}
