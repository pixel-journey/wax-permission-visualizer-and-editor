export function RelatedBlueprints() {
  const links = [
    {
      href: "https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions",
      label: "Session keys & linked permissions",
    },
    {
      href: "https://github.com/pixel-journey/wax-account-permission-auditor",
      label: "Account permission auditor",
    },
    {
      href: "https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools",
      label: "Social recovery & key backup",
    },
  ];

  return (
    <section className="mt-10 border-t border-white/10 pt-6 text-xs opacity-80">
      <p className="mb-2 tracking-widest text-[10px] uppercase">Related blueprints</p>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <a
              className="text-emerald-400 underline"
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
