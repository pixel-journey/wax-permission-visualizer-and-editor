export type GlossaryEntry = { term: string; def: string };

export const PERMISSION_GLOSSARY: GlossaryEntry[] = [
  {
    term: "owner",
    def: "Top permission. Can change any authority on the account, including itself. Losing all owner weight can lock the account permanently.",
  },
  {
    term: "active",
    def: "Default daily permission. Parents to owner. Cannot replace owner. Used for most transfers and dApp actions unless scoped otherwise.",
  },
  {
    term: "threshold",
    def: "Minimum combined weight of keys and/or account authorities required to authorize under that permission.",
  },
  {
    term: "account authority",
    def: "Another account@permission listed with a weight (e.g. bob@active weight 1 on alice@owner). Common for multi-sig and social recovery.",
  },
  {
    term: "linkauth",
    def: "Binds a permission name to a specific contract::action so that permission is only valid for that action path.",
  },
  {
    term: "updateauth",
    def: "System action that creates or updates a permission's required_auth (keys, accounts, threshold). Requires authority of the parent (or higher).",
  },
  {
    term: "deleteauth",
    def: "Removes a custom permission. Cannot delete owner or active.",
  },
  {
    term: "waits",
    def: "Optional time delays on a permission authority. Signers may need to wait N seconds before the authority path can complete. Does not create missing recovery weight.",
  },
  {
    term: "WharfKit",
    def: "Modern Antelope client stack (Session Kit, plugins). Prefer over eosjs / UAL for greenfield dApps.",
  },
];
