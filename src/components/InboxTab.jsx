import { useState } from 'react';
import PostCard from './PostCard';
import ScheduleModal from './ScheduleModal';

export default function InboxTab({ posts, groups, onRefresh }) {
  const [modal, setModal] = useState(null);
  const inbox = posts.filter(p => p.status === 'inbox');

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
      <div className="flex flex-col gap-4">
        {inbox.map(post => (
          <PostCard
            key={post.id}
            post={post}
            groups={groups}
            onSchedule={setModal}
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
