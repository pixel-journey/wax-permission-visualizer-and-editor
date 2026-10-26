export function RelatedBlueprints() {
  const links = [
    {
      href: "https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions",
      label: "Session keys & linked permissions",
      why: "Custom perms + linkauth for dApp loops",
    },
    {
      href: "https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools",
      label: "Social recovery & key backup",
      why: "Owner weights, runbooks, collusion math",
    },
    {
      href: "https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator",
      label: "Multi-sig proposal builder",
      why: "Propose / approve / exec authority changes",
    },
    {
      href: "https://github.com/pixel-journey/wax-hardware-wallet-integration-patterns",
      label: "Hardware wallet patterns",
      why: "Keep owner cold on device",
    },
    {
      href: "https://github.com/pixel-journey/wax-account-permission-auditor",
      label: "Account permission auditor",
      why: "Batch / multi-account risk scans",
    },
    {
      href: "https://github.com/pixel-journey/wax-safe-key-rotation-assistant",
      label: "Safe key rotation assistant",
      why: "Rotate without locking yourself out",
    },
  ];

  return (
    <section className="mt-10 border-t border-white/10 pt-6 text-xs">
      <p className="mb-3 tracking-widest text-[10px] uppercase opacity-60">
        Related blueprints
      </p>
      <ul className="space-y-3 max-w-xl">
        {links.map((l) => (
          <li key={l.href}>
            <a
              className="text-emerald-400 underline font-mono"
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
            <p className="text-white/50 mt-0.5">{l.why}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
