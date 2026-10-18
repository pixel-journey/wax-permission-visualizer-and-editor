/**
 * Unit test skeleton for pure client-side permission engine.
 * Run with: npx vitest run lib/permissionEngine.test.ts (after adding vitest)
 *
 * Status: UNTESTED — add vitest dependency and run to mark VERIFIED.
 */
import { describe, it, expect } from 'vitest';
import { calculateThreshold, validateProposedChange, canSatisfyPermission } from './permissionEngine';
import type { PermissionNode, PermissionGraph } from './types';

describe('calculateThreshold', () => {
  const basePerm: PermissionNode = {
    name: 'active',
    threshold: 2,
    keys: [
      { key: 'key1', weight: 1 },
      { key: 'key2', weight: 1 },
      { key: 'key3', weight: 1 },
    ],
    accounts: [],
  };

  it('returns canExecute true when weight meets threshold', () => {
    const result = calculateThreshold(basePerm, ['key1', 'key2']);
    expect(result.canExecute).toBe(true);
    expect(result.currentWeight).toBe(2);
    expect(result.missingWeight).toBe(0);
    expect(result.riskLevel).toBe('safe');
  });

  it('returns canExecute false and warning when insufficient', () => {
    const result = calculateThreshold(basePerm, ['key1']);
    expect(result.canExecute).toBe(false);
    expect(result.missingWeight).toBe(1);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('flags critical owner warning when missing weight', () => {
    const ownerPerm: PermissionNode = { ...basePerm, name: 'owner', threshold: 1 };
    const result = calculateThreshold(ownerPerm, []);
    expect(result.warnings.some(w => w.includes('CRITICAL'))).toBe(true);
  });
});

describe('validateProposedChange', () => {
  const current: PermissionGraph = {
    account: 'test',
    permissions: {
      owner: { name: 'owner', threshold: 1, keys: [{ key: 'k1', weight: 1 }], accounts: [] },
    },
    lastUpdated: '',
  };

  it('warns on owner threshold of 0', () => {
    const proposed: PermissionGraph = {
      ...current,
      permissions: {
        owner: { name: 'owner', threshold: 0, keys: [{ key: 'k1', weight: 1 }], accounts: [] },
      },
    };
    const warnings = validateProposedChange(current, proposed);
    expect(warnings.some(w => w.level === 'danger' && w.message.includes('locked'))).toBe(true);
  });

  it('warns when total weight below threshold', () => {
    const proposed: PermissionGraph = {
      ...current,
      permissions: {
        owner: { name: 'owner', threshold: 3, keys: [{ key: 'k1', weight: 1 }], accounts: [] },
      },
    };
    const warnings = validateProposedChange(current, proposed);
    expect(warnings.some(w => w.message.includes('below threshold'))).toBe(true);
  });
});

describe('canSatisfyPermission', () => {
  it('returns true for sufficient keys', () => {
    const perm: PermissionNode = {
      name: 'active',
      threshold: 1,
      keys: [{ key: 'k1', weight: 1 }],
      accounts: [],
    };
    expect(canSatisfyPermission(perm, ['k1'])).toBe(true);
  });
});
