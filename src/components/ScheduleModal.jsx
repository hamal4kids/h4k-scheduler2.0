import { useState } from 'react';
import { N8N_WEBHOOK_URL } from '../config';

export default function ScheduleModal({ post, groups, onClose, onDone }) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  const defaultDT = now.toISOString().slice(0, 16);

  const [scheduledAt, setScheduledAt] = useState(defaultDT);
  const [allGroups, setAllGroups]     = useState(true);
  const [selected, setSelected]       = useState([]);
  const [saving, setSaving]           = useState(false);
  const [err, setErr]                 = useState(null);

  const activeGroups = groups.filter(g => g.active === 'TRUE');

  function toggleGroup(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function handleConfirm() {
    if (!scheduledAt) { setErr('יש לבחור תאריך ושעה'); return; }
    if (!allGroups && selected.length === 0) { setErr('יש לבחור לפחות קבוצה אחת'); return; }

    setSaving(true);
    setErr(null);
    const target_groups = allGroups ? 'ALL' : selected.join(',');

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          sheet: 'posts',
          id: post.id,
          fields: {
            status: 'scheduled',
            scheduled_at: scheduledAt.replace('T', ' ') + ':00',
            target_groups,
          },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        onDone();
      } else {
        setErr('שגיאה בשמירה: ' + (data.error || 'לא ידוע'));
      }
    } catch (e) {
      setErr('שגיאה בחיבור לשרת');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="h4k-card w-full max-w-md flex flex-col gap-5" onClick={e => e.stopPropagation()}>
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="font-fredoka text-h4k-primary text-2xl">תזמון פוסט</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Content preview */}
        <div className="bg-h4k-bg rounded-xl p-4">
          <p className="font-assistant text-sm text-h4k-dark line-clamp-3 whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Date + Time */}
        <div className="flex flex-col gap-1">
          <label className="font-varela text-sm text-h4k-dark">📅 תאריך ושעה</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
            className="border-2 border-h4k-primary rounded-xl px-4 py-2.5 font-assistant text-sm outline-none focus:ring-2 focus:ring-h4k-highlight"
          />
        </div>

        {/* Groups */}
        <div className="flex flex-col gap-2">
          <label className="font-varela text-sm text-h4k-dark">👥 קבוצות יעד</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allGroups}
              onChange={e => setAllGroups(e.target.checked)}
              className="accent-h4k-primary w-4 h-4"
            />
            <span className="font-assistant text-sm">כל הקבוצות הפעילות</span>
          </label>
          {!allGroups && (
            <div className="flex flex-col gap-1.5 pr-2 mt-1 max-h-36 overflow-y-auto">
              {activeGroups.map(g => (
                <label key={g.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(g.id)}
                    onChange={() => toggleGroup(g.id)}
                    className="accent-h4k-primary w-4 h-4"
                  />
                  <span className="font-assistant text-sm">{g.name}</span>
                  {g.type === 'specialized' && (
                    <span className="text-xs bg-h4k-highlight/30 text-h4k-dark px-1.5 rounded">מתמחה</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {err && <p className="text-red-500 font-assistant text-sm">{err}</p>}

        {/* Actions */}
        <div className="flex gap-3 justify-end mt-1">
          <button onClick={onClose} className="btn-ghost">ביטול</button>
          <button onClick={handleConfirm} disabled={saving} className="btn-primary">
            <span>{saving ? '⏳' : '✅'}</span>
            {saving ? 'שומר...' : 'אשרי תזמון'}
          </button>
        </div>
      </div>
    </div>
  );
}
