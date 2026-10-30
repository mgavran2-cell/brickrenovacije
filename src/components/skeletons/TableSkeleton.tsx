interface TableSkeletonProps {
  rows?: number;
}

const CELL_WIDTHS = ["w-1/3", "w-1/4", "w-1/5", "w-1/6", "w-1/4"];

/**
 * Skeleton za tablice (admin Upiti, Izvođači).
 * Svaki red ima 5 ćelija s pulsirajućim pravokutnicima različite širine.
 */
const TableSkeleton = ({ rows = 5 }: TableSkeletonProps) => (
  <div className="bg-dash-card border border-dash-border rounded-2xl overflow-hidden">
    <div className="flex gap-6 px-6 py-4 border-b border-dash-border">
      {CELL_WIDTHS.map((w, i) => (
        <div key={i} className={`h-3 rounded bg-dash-soft animate-pulse ${w}`} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-6 px-6 py-4 border-b border-dash-soft last:border-0">
        {CELL_WIDTHS.map((w, c) => (
          <div key={c} className={`h-3.5 rounded bg-dash-soft animate-pulse ${w}`} />
        ))}
      </div>
    ))}
  </div>
);

export default TableSkeleton;
