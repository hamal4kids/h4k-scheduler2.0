import { useState } from 'react';
import { N8N_WEBHOOK_URL } from '../config';

export default function GroupsTab({ groups, onRefresh }) {
  const [saving, setSaving] = useState(null);

  async function toggleActive(group) {
    setSaving(group.id);
    const newVal = group.active === 'TRUE' ? 'FALSE' : 'TRUE';
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
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

  if (groups.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-3">👥</div>
        <p className="font-varela text-gray-500">אין קבוצות מוגדרות עדיין</p>
      </div>
    );
  }

  const general    = groups.filter(g => g.type === 'general');
  const specialized = groups.filter(g => g.type === 'specialized');

  function GroupCard({ group }) {
    const isActive = group.active === 'TRUE';
    return (
      <div className="h4k-card flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-varela text-base text-h4k-dark">{group.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-assistant
              ${group.type === 'specialized' ? 'bg-h4k-highlight/30 text-h4k-dark' : 'bg-h4k-secondary/15 text-h4k-secondary'}`}>
              {group.type === 'specialized' ? 'מתמחה' : 'כללי'}
            </span>
          </div>
          {group.beacon_chat_id && (
            <span className="font-assistant text-xs text-gray-400 truncate">
              ID: {group.beacon_chat_id}
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
    </div>
  );
}
