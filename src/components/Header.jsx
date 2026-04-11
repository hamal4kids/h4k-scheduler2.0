export default function Header({ lastSync, onRefresh, loading }) {
  const syncText = lastSync
    ? `עדכון: ${lastSync.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`
    : '';

  return (
    <header className="bg-h4k-primary shadow-md overflow-visible relative z-10">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Left: refresh + sync */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 text-white rounded-pill px-5 py-2
                       font-rubik font-semibold text-base transition-all flex items-center gap-2"
          >
            <span className={loading ? 'animate-spin inline-block' : ''}>🔄</span>
            רענן
          </button>
          {syncText && (
            <span className="font-assistant text-white/60 text-sm hidden sm:block">{syncText}</span>
          )}
        </div>

        {/* Right: title + logo (RTL → visually right) */}
        <div className="flex items-center gap-4">
          <div className="text-left">
            <h1 className="font-fredoka text-white text-3xl leading-tight">H4K Scheduler</h1>
            <p className="font-varela text-white/70 text-sm">חמ״ל לילדים — תזמון הודעות</p>
          </div>
          {/* Logo — big, circular, overflows below header */}
          <div className="relative -mb-8 w-24 h-24 rounded-full bg-white shadow-2xl
                          ring-4 ring-white/40 flex-shrink-0 overflow-hidden">
            <img
              src="/h4k-scheduler2.0/logo.png"
              alt="H4K"
              className="w-full h-full object-contain p-1"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
