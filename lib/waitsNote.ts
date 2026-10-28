/** Educational note on Antelope permission waits (time delays). */

export const WAITS_EDUCATION = {
  title: "Waits (time-delay authorities)",
  body: [
    "Antelope permissions can include waits: a required delay before an authority becomes effective.",
    "Example: a wait of 86400 seconds means signers must wait ~24h after proposing before the action can execute under that path.",
    "This visualizer focuses on keys, account-auth, and thresholds. Full wait modeling belongs in multi-sig / ops runbooks when you rely on delayed owner changes.",
    "Never treat a wait as a backup for missing owner keys — delays do not create recovery weight you do not have.",
  ],
};
