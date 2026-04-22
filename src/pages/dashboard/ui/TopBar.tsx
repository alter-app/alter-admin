import { Icon } from './components/Icon'

export function TopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="flex h-16 items-center justify-between px-8">
      <div className="text-[18px] font-semibold text-emerald-800">홈</div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-gray-500 hover:bg-gray-50"
          aria-label="알림"
        >
          <Icon name="bell" className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-gray-500 hover:bg-gray-50"
          aria-label="설정"
        >
          <Icon name="settings" className="h-5 w-5" />
        </button>

        <div className="ml-2 flex items-center gap-3 rounded-full bg-white px-3 py-2 ring-1 ring-gray-100">
          <div className="text-right leading-tight">
            <div className="text-[13px] font-semibold text-gray-900">Alex Rivera</div>
            <div className="text-[10px] font-semibold tracking-wide text-emerald-700">수석 분석가</div>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-emerald-100">
            <div className="grid h-full w-full place-items-center text-[12px] font-bold text-emerald-800">
              AR
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="ml-2 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
        >
          로그아웃
        </button>
      </div>
    </header>
  )
}

