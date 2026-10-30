/**
 * Skeleton za kartice (projekti, ponude).
 * Veliki pravokutnik kao placeholder za sliku + dvije linije teksta.
 */
const CardSkeleton = () => (
  <div className="bg-dash-card border border-dash-border rounded-2xl p-4 space-y-4">
    <div className="w-full aspect-[4/3] rounded-2xl bg-dash-soft animate-pulse" />
    <div className="space-y-2 px-1 pb-1">
      <div className="h-4 w-3/5 rounded bg-dash-soft animate-pulse" />
      <div className="h-3 w-2/5 rounded bg-dash-soft animate-pulse" />
    </div>
  </div>
);

export default CardSkeleton;
