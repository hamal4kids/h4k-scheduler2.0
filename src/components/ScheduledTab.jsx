import { useState } from 'react';
import PostCard from './PostCard';
import ScheduleModal from './ScheduleModal';
import { N8N_WEBHOOK_URL } from '../config';

export default function ScheduledTab({ posts, groups, onRefresh }) {
  const [editModal, setEditModal] = useState(null);
  const scheduled = posts
    .filter(p => p.status?.trim().toLowerCase() === 'scheduled')
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

  async function handleCancel(post) {
    if (!confirm(`לבטל את תזמון הפוסט הזה?`)) return;
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-post',
          id: post.id,
          fields: { status: 'inbox', scheduled_at: '', target_groups: '' },
        }),
      });
      onRefresh();
    } catch {
      alert('שגיאה בביטול התזמון');
    }
  }

  if (scheduled.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-3">🕐</div>
        <p className="font-varela text-gray-500">אין פוסטים מתוזמנים כרגע</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scheduled.map(post => (
          <PostCard
            key={post.id}
            post={post}
            groups={groups}
            onSchedule={setEditModal}
            onCancel={handleCancel}
          />
        ))}
      </div>

      {editModal && (
        <ScheduleModal
          post={editModal}
          groups={groups}
          onClose={() => setEditModal(null)}
          onDone={() => { setEditModal(null); onRefresh(); }}
        />
      )}
    </>
  );
}
