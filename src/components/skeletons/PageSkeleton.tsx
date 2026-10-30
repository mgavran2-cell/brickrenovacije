/**
 * Skeleton za detaljnu stranicu:
 * mala linija (eyebrow), velika linija (naslov), tri reda teksta,
 * dvije velike kartice side-by-side.
 */
const PageSkeleton = () => (
  <div className="p-6 md:p-10 space-y-8">
    <div className="space-y-3">
      <div className="h-3 w-24 rounded bg-dash-soft animate-pulse" />
      <div className="h-8 w-1/2 rounded bg-dash-soft animate-pulse" />
    </div>
    <div className="space-y-2.5">
      <div className="h-3.5 w-full rounded bg-dash-soft animate-pulse" />
      <div className="h-3.5 w-11/12 rounded bg-dash-soft animate-pulse" />
      <div className="h-3.5 w-3/4 rounded bg-dash-soft animate-pulse" />
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="h-48 rounded-2xl bg-dash-soft animate-pulse" />
      <div className="h-48 rounded-2xl bg-dash-soft animate-pulse" />
    </div>
  </div>
);

export default PageSkeleton;
