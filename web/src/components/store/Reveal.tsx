// Passthrough for now — Part 4 (animations) upgrades this into a scroll-reveal
// wrapper. Kept as a component so the homepage sections don't need rewiring.
export function Reveal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
