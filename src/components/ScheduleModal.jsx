import { useState } from 'react';
import { N8N_WEBHOOK_URL } from '../config';

export default function ScheduleModal({ post, groups, onClose, onDone }) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  const defaultDT = now.toISOString().slice(0, 16);

  const [scheduledAt, setScheduledAt]     = useState(defaultDT);
  const [allGroups, setAllGroups]         = useState(true);
  const [selectedTags, setSelectedTags]   = useState([]);
  const [selectedIds, setSelectedIds]     = useState([]);
  const [saving, setSaving]               = useState(false);
  const [err, setErr]                     = useState(null);

  const activeGroups = groups.filter(g => g.active === 'TRUE');

  // Unique tags from all active groups
  const allTags = [...new Set(
    activeGroups.flatMap(g => (g.tags || '').split(',').map(t => t.trim()).filter(Boolean))
  )].sort();

  // Groups with no tags — must be picked individually
  const untaggedGroups = activeGroups.filter(g => !(g.tags || '').trim());

  // Groups covered by currently selected tags
  const coveredByTags = new Set(
    activeGroups
      .filter(g => selectedTags.some(tag =>
        (g.tags || '').split(',').map(t => t.trim()).includes(tag)
      ))
      .map(g => g.id)
  );

  function toggleTag(tag) {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  function toggleId(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  async function handleConfirm() {
    if (!scheduledAt) { setErr('יש לבחור תאריך ושעה'); return; }
    if (!allGroups && selectedTags.length === 0 && selectedIds.length === 0) {
      setErr('יש לבחור לפחות תגית או קבוצה אחת');
      return;
    }

    setSaving(true);
    setErr(null);

    const target_groups = allGroups
      ? 'ALL'
      : [...selectedTags, ...selectedIds].join(',');

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-post',
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
    } catch {
      setErr('שגיאה בחיבור לשרת');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="h4k-card w-full max-w-md flex flex-col gap-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

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

        {/* Target */}
        <div className="flex flex-col gap-3">
          <label className="font-varela text-sm text-h4k-dark">👥 קבוצות יעד</label>

          {/* All groups toggle */}
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
            <div className="flex flex-col gap-3 pr-1">

              {/* Tags */}
              {allTags.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-assistant text-xs text-gray-500">לפי תגית</span>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full font-assistant text-sm border-2 transition-colors
                          ${selectedTags.includes(tag)
                            ? 'bg-h4k-primary text-white border-h4k-primary'
                            : 'bg-white text-h4k-dark border-h4k-primary/40 hover:border-h4k-primary'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual groups */}
              {activeGroups.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-assistant text-xs text-gray-500">קבוצה ספציפית</span>
                  <div className="flex flex-col gap-1.5">
                    {activeGroups.map(g => {
                      const covered = coveredByTags.has(g.id);
                      return (
                        <label key={g.id} className={`flex items-center gap-2 cursor-pointer ${covered ? 'opacity-50' : ''}`}>
                          <input
                            type="checkbox"
                            checked={covered || selectedIds.includes(g.id)}
                            disabled={covered}
                            onChange={() => toggleId(g.id)}
                            className="accent-h4k-primary w-4 h-4"
                          />
                          <span className="font-assistant text-sm">{g.name}</span>
                          {covered && <span className="font-assistant text-xs text-gray-400">(מכוסה ע״י תגית)</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
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
