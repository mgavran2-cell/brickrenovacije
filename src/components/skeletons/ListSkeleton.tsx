/**
 * Skeleton za liste s avatarima (poruke, upiti).
 * 4 reda: krug lijevo + dvije pulsirajuće linije desno.
 */
const ListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-full bg-dash-soft animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/5 rounded bg-dash-soft animate-pulse" />
          <div className="h-3 w-1/4 rounded bg-dash-soft animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default ListSkeleton;
