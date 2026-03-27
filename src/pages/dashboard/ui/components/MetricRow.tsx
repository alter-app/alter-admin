export function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
      <div className="text-[10px] font-semibold tracking-wide text-gray-400">{label}</div>
      <div className="text-[12px] font-semibold text-gray-700">{value}</div>
    </div>
  )
}

