export default function Loading() {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
        <div className="h-8 w-40 bg-muted animate-pulse rounded" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="h-[300px] rounded-lg bg-muted animate-pulse" />
          <div className="h-[400px] rounded-lg bg-muted animate-pulse" />
        </div>
        <div>
          <div className="h-[300px] rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  )
}

