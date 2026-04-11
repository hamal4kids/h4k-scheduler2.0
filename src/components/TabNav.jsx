const TABS = [
  { id: 'inbox',     label: 'Inbox',    emoji: '📥' },
  { id: 'scheduled', label: 'מתוזמן',   emoji: '🕐' },
  { id: 'sent',      label: 'נשלח',     emoji: '✅' },
  { id: 'groups',    label: 'קבוצות',   emoji: '👥' },
];

export default function TabNav({ active, onChange, counts }) {
  return (
    <nav className="bg-white shadow-sm pt-10">
      <div className="max-w-4xl mx-auto px-4 flex gap-2 pb-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-pill text-base transition-all
              ${active === tab.id ? 'tab-active' : 'tab-inactive'}`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
            {counts[tab.id] > 0 && (
              <span className={`badge text-xs ${active === tab.id ? 'bg-white/30 text-white' : 'bg-h4k-primary text-white'}`}>
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
