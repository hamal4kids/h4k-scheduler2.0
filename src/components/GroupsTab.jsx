import { useState } from 'react';
import { N8N_WEBHOOK_URL } from '../config';

export default function GroupsTab({ groups, onRefresh }) {
  const [saving, setSaving] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', beacon_chat_id: '', type: 'general' });
  const [adding, setAdding] = useState(false);

  async function toggleActive(group) {
    setSaving(group.id);
    const newVal = group.active === 'TRUE' ? 'FALSE' : 'TRUE';
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          sheet: 'groups',
          id: group.id,
          fields: { active: newVal },
        }),
      });
      onRefresh();
    } catch {
      alert('שגיאה בעדכון הקבוצה');
    } finally {
      setSaving(null);
    }
  }

  async function handleAddGroup(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.beacon_chat_id.trim()) return;
    setAdding(true);
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'append',
          sheet: 'groups',
          fields: {
            id: `g_${Date.now()}`,
            name: form.name.trim(),
            beacon_chat_id: form.beacon_chat_id.trim(),
            type: form.type,
            active: 'TRUE',
          },
        }),
      });
      setForm({ name: '', beacon_chat_id: '', type: 'general' });
      setShowForm(false);
      onRefresh();
    } catch {
      alert('שגיאה בהוספת הקבוצה');
    } finally {
      setAdding(false);
    }
  }

  const general    = groups.filter(g => g.type === 'general'    && g.active !== 'DELETED');
  const specialized = groups.filter(g => g.type === 'specialized' && g.active !== 'DELETED');

  function GroupCard({ group }) {
    const isActive = group.active === 'TRUE';
    return (
      <div className="h4k-card flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-varela text-base text-h4k-dark">{group.name}</span>
          {group.beacon_chat_id && (
            <span className="font-assistant text-xs text-gray-400 truncate">
              {group.beacon_chat_id}
            </span>
          )}
        </div>
        <button
          onClick={() => toggleActive(group)}
          disabled={saving === group.id}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0
            ${isActive ? 'bg-h4k-secondary' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all
            ${isActive ? 'right-0.5' : 'left-0.5'}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Add Group Button */}
      <button onClick={() => setShowForm(v => !v)} className="btn-primary self-start">
        <span>{showForm ? '✕' : '+'}</span>
        {showForm ? 'ביטול' : 'הוסף קבוצה'}
      </button>

      {/* Add Group Form */}
      {showForm && (
        <form onSubmit={handleAddGroup} className="h4k-card flex flex-col gap-4">
          <h3 className="font-fredoka text-h4k-primary text-xl">קבוצה חדשה</h3>

          <div className="flex flex-col gap-1">
            <label className="font-varela text-sm text-h4k-dark">שם הקבוצה</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="למשל: הורים ת׳א צפון"
              className="border-2 border-h4k-primary rounded-xl px-4 py-2.5 font-assistant text-sm outline-none focus:ring-2 focus:ring-h4k-highlight"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-varela text-sm text-h4k-dark">WhatsApp Group ID</label>
            <input
              type="text"
              value={form.beacon_chat_id}
              onChange={e => setForm(f => ({ ...f, beacon_chat_id: e.target.value }))}
              placeholder="120363XXXXXXXXXX@g.us"
              className="border-2 border-h4k-primary rounded-xl px-4 py-2.5 font-assistant text-sm outline-none focus:ring-2 focus:ring-h4k-highlight"
              dir="ltr"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-varela text-sm text-h4k-dark">סוג</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="border-2 border-h4k-primary rounded-xl px-4 py-2.5 font-assistant text-sm outline-none"
            >
              <option value="general">כללי — מקבל את כל הפוסטים</option>
              <option value="specialized">מתמחה — בחירה ידנית בכל פוסט</option>
            </select>
          </div>

          <button type="submit" disabled={adding} className="btn-primary self-start">
            <span>{adding ? '⏳' : '✅'}</span>
            {adding ? 'שומר...' : 'הוסף קבוצה'}
          </button>
        </form>
      )}

      {/* General Groups */}
      {general.length > 0 && (
        <section>
          <h3 className="font-varela text-h4k-primary text-sm mb-3 flex items-center gap-2">
            <span className="bg-h4k-highlight px-2 py-0.5 rounded text-h4k-dark">קבוצות כלליות</span>
            <span className="text-gray-400">— מקבלות את כל הפוסטים</span>
          </h3>
          <div className="flex flex-col gap-3">
            {general.map(g => <GroupCard key={g.id} group={g} />)}
          </div>
        </section>
      )}

      {/* Specialized Groups */}
      {specialized.length > 0 && (
        <section>
          <h3 className="font-varela text-h4k-primary text-sm mb-3 flex items-center gap-2">
            <span className="bg-h4k-highlight px-2 py-0.5 rounded text-h4k-dark">קבוצות מתמחות</span>
            <span className="text-gray-400">— בחירה ידנית בכל פוסט</span>
          </h3>
          <div className="flex flex-col gap-3">
            {specialized.map(g => <GroupCard key={g.id} group={g} />)}
          </div>
        </section>
      )}

      {groups.length === 0 && !showForm && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">👥</div>
          <p className="font-varela text-gray-500">אין קבוצות — לחצי על "הוסף קבוצה"</p>
        </div>
      )}
    </div>
  );
}
