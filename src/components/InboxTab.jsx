import { useState } from 'react';
import PostCard from './PostCard';
import ScheduleModal from './ScheduleModal';
import { N8N_WEBHOOK_URL } from '../config';

export default function InboxTab({ posts, groups, onRefresh }) {
  const [modal, setModal] = useState(null);
  const [deletedIds, setDeletedIds] = useState(new Set());

  const inbox = posts
    .filter(p => p.status === 'inbox' && !deletedIds.has(p.id));

  async function handleDelete(post) {
    if (!confirm('למחוק פוסט זה?')) return;
    setDeletedIds(prev => new Set([...prev, post.id]));
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          sheet: 'posts',
          id: post.id,
          fields: { status: 'archived' },
        }),
      });
    } catch {
      setDeletedIds(prev => { const n = new Set(prev); n.delete(post.id); return n; });
      alert('שגיאה במחיקת הפוסט');
    }
  }

  if (inbox.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-3">📭</div>
        <p className="font-varela text-gray-500">ה-Inbox ריק — הכל מתוזמן 🎉</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {inbox.map(post => (
          <PostCard
            key={post.id}
            post={post}
            groups={groups}
            onSchedule={setModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {modal && (
        <ScheduleModal
          post={modal}
          groups={groups}
          onClose={() => setModal(null)}
          onDone={() => { setModal(null); onRefresh(); }}
        />
      )}
    </>
  );
}
