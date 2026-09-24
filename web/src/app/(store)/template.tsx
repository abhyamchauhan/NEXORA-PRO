// A template re-mounts on every navigation (unlike a layout), so this replays
// the fade+rise entrance on each store page change — no hard flashes between
// Home → Shop → Product → Cart. Header/footer live in the layout and stay put.
export default function StoreTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-enter">{children}</div>;
}
