import { useState } from 'react';
import { N8N_WEBHOOK_URL } from '../config';

const INPUT_CLS = 'border-2 border-h4k-primary rounded-xl px-3 py-1.5 font-assistant text-sm outline-none focus:ring-2 focus:ring-h4k-highlight w-full';

async function postWebhook(body) {
  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function GroupsTab({ groups, onRefresh }) {
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ name: '', beacon_chat_id: '', tags: '' });
  const [adding, setAdding]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [saving, setSaving]       = useState(false);
  const [toggling, setToggling]   = useState(null);

  async function handleAddGroup(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.beacon_chat_id.trim()) return;
    setAdding(true);
    try {
      await postWebhook({
        action: 'append-group',
        fields: {
          id: `g_${Date.now()}`,
          name: form.name.trim(),
          beacon_chat_id: form.beacon_chat_id.trim(),
          active: 'TRUE',
          tags: form.tags.trim(),
        },
      });
      setForm({ name: '', beacon_chat_id: '', tags: '' });
      setShowForm(false);
      onRefresh();
    } catch {
      alert('שגיאה בהוספת הקבוצה');
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(group) {
    setToggling(group.id);
    try {
      await postWebhook({
        action: 'update-group',
        id: group.id,
        fields: { active: group.active === 'TRUE' ? 'FALSE' : 'TRUE' },
      });
      onRefresh();
    } catch {
      alert('שגיאה בעדכון הקבוצה');
    } finally {
      setToggling(null);
    }
  }

  function startEdit(group) {
    setEditingId(group.id);
    setEditForm({ name: group.name, beacon_chat_id: group.beacon_chat_id, tags: group.tags || '' });
  }

  async function handleSaveEdit(id) {
    setSaving(true);
    try {
      await postWebhook({
        action: 'update-group',
        id,
        fields: {
          name: editForm.name.trim(),
          beacon_chat_id: editForm.beacon_chat_id.trim(),
          tags: editForm.tags.trim(),
        },
      });
      setEditingId(null);
      onRefresh();
    } catch {
      alert('שגיאה בשמירת הקבוצה');
    } finally {
      setSaving(false);
    }
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
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="למשל: הורים ת׳א צפון" className={INPUT_CLS} required />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-varela text-sm text-h4k-dark">WhatsApp Group ID</label>
            <input type="text" value={form.beacon_chat_id} onChange={e => setForm(f => ({ ...f, beacon_chat_id: e.target.value }))}
              placeholder="120363XXXXXXXXXX@g.us" className={INPUT_CLS} dir="ltr" required />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-varela text-sm text-h4k-dark">🏷️ תגיות (מופרדות בפסיק)</label>
            <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="למשל: ירושלים,כללי" className={INPUT_CLS} />
          </div>

          <button type="submit" disabled={adding} className="btn-primary self-start">
            <span>{adding ? '⏳' : '✅'}</span> {adding ? 'שומר...' : 'הוסף קבוצה'}
          </button>
        </form>
      )}

      {/* Groups Table */}
      {groups.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-sm font-assistant">
            <thead className="bg-h4k-bg text-h4k-dark">
              <tr>
                <th className="text-right px-4 py-3 font-varela">שם</th>
                <th className="text-right px-4 py-3 font-varela">תגיות</th>
                <th className="text-right px-4 py-3 font-varela">Group ID</th>
                <th className="text-right px-4 py-3 font-varela">פעילה</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {groups.map((g, i) => {
                const isEditing = editingId === g.id;
                const tags = (g.tags || '').split(',').map(t => t.trim()).filter(Boolean);
                return (
                  <tr key={g.id} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>

                    {/* Name */}
                    <td className="px-4 py-3">
                      {isEditing
                        ? <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className={INPUT_CLS} />
                        : <span className="text-h4k-dark font-medium">{g.name}</span>
                      }
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-3">
                      {isEditing
                        ? <input value={editForm.tags} onChange={e => setEditForm(f => ({ ...f, tags: e.target.value }))}
                            placeholder="ירושלים,כללי" className={INPUT_CLS} />
                        : tags.length > 0
                          ? <div className="flex flex-wrap gap-1">
                              {tags.map(tag => (
                                <span key={tag} className="bg-h4k-highlight text-h4k-dark text-xs px-2 py-0.5 rounded-full">{tag}</span>
                              ))}
                            </div>
                          : <span className="text-gray-400 text-xs">ללא תגית</span>
                      }
                    </td>

                    {/* Beacon Chat ID */}
                    <td className="px-4 py-3">
                      {isEditing
                        ? <input value={editForm.beacon_chat_id} onChange={e => setEditForm(f => ({ ...f, beacon_chat_id: e.target.value }))}
                            className={INPUT_CLS} dir="ltr" />
                        : <span className="text-gray-400 text-xs font-mono">{g.beacon_chat_id || '—'}</span>
                      }
                    </td>

                    {/* Active Toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(g)}
                        disabled={toggling === g.id}
                        className={`relative w-11 h-6 rounded-full transition-colors ${g.active === 'TRUE' ? 'bg-h4k-secondary' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${g.active === 'TRUE' ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-left whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveEdit(g.id)} disabled={saving} className="btn-primary py-1 px-3 text-xs">
                            {saving ? '⏳' : '✅'} שמור
                          </button>
                          <button onClick={() => setEditingId(null)} className="btn-ghost py-1 px-3 text-xs">ביטול</button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(g)} className="btn-ghost py-1 px-3 text-xs">✏️ ערוך</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : !showForm && (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">👥</div>
          <p className="font-varela text-gray-500">אין קבוצות — לחצי על "הוסף קבוצה"</p>
        </div>
      )}
    </div>
  );
}
