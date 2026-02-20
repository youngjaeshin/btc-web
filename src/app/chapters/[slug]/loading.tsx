const widths = [95, 82, 88, 76, 91, 84, 78, 87];

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-muted" />
        <div>
          <div className="h-4 w-20 bg-muted rounded mb-2" />
          <div className="h-7 w-48 bg-muted rounded" />
        </div>
      </div>
      <div className="h-4 w-full bg-muted rounded mb-3" />
      <div className="h-4 w-3/4 bg-muted rounded mb-8" />
      <div className="space-y-4">
        {widths.map((w, i) => (
          <div key={i} className="h-4 bg-muted rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
