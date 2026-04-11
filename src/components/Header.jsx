export default function Header({ lastSync, onRefresh, loading }) {
  const syncText = lastSync
    ? `עדכון אחרון: ${lastSync.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`
    : 'טוען...';

  return (
    <header className="bg-h4k-primary shadow-md">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦁</span>
          <div>
            <h1 className="font-fredoka text-white text-2xl leading-none">H4K Scheduler</h1>
            <p className="font-assistant text-white/70 text-xs">חמ״ל לילדים — תזמון הודעות</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-assistant text-white/70 text-xs hidden sm:block">{syncText}</span>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 text-white rounded-pill px-4 py-1.5 font-assistant text-sm transition-all flex items-center gap-1.5"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
            רענן
          </button>
        </div>
      </div>
    </header>
  );
}
