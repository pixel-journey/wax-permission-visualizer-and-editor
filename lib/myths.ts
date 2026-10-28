export type Myth = { myth: string; reality: string };

export const PERMISSION_MYTHS: Myth[] = [
  {
    myth: "active can recover a lost owner key",
    reality:
      "Only owner (or multi-party owner authorities) can change owner. Active cannot heal owner.",
  },
  {
    myth: "Any account@active on owner means active controls owner",
    reality:
      "Only this account's own active on its owner is the anti-pattern. Foreign bob@active weights are normal social recovery.",
  },
  {
    myth: "Higher threshold is always safer",
    reality:
      "Threshold above total weight is impossible — the permission can never authorize.",
  },
  {
    myth: "Custom permissions are enough without linkauth",
    reality:
      "Without linkauth, a limited key's permission may still be usable more broadly depending on contract checks. Prefer explicit links.",
  },
  {
    myth: "One get_account snapshot is a full security audit",
    reality:
      "Also verify offline backups, helper trust, and that linked_actions match what the dApp claims.",
  },
];
