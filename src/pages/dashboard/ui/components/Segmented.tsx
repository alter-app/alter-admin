export function Segmented() {
  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1 text-[11px] font-semibold text-gray-500">
      <button
        type="button"
        className="rounded-full px-4 py-1.5 hover:bg-white hover:text-gray-800"
      >
        주
      </button>
      <button
        type="button"
        className="rounded-full bg-emerald-700 px-4 py-1.5 text-white shadow-sm"
      >
        월
      </button>
      <button
        type="button"
        className="rounded-full px-4 py-1.5 hover:bg-white hover:text-gray-800"
      >
        년
      </button>
    </div>
  )
}
