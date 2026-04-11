function formatDate(str) {
  if (!str) return '';
  try {
    return new Date(str).toLocaleString('he-IL', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return str; }
}

export default function PostCard({ post, groups, onSchedule, onCancel, onDelete }) {
  const groupLabel = (ids) => {
    if (!ids || ids === 'ALL') return 'כל הקבוצות';
    return ids.split(',').map(id => {
      const g = groups.find(g => g.id === id.trim());
      return g ? g.name : id.trim();
    }).join(' • ');
  };

  return (
    <div className="h4k-card flex flex-col gap-4">

      {/* Image */}
      {post.media_url && (
        <img
          src={post.media_url}
          alt=""
          className="w-full rounded-2xl object-cover aspect-square"
          loading="lazy"
        />
      )}

      {/* Content */}
      <p className="font-varela text-lg text-h4k-dark leading-relaxed whitespace-pre-wrap">
        {post.content || <span className="text-gray-400 italic text-base">אין תוכן</span>}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {post.target_groups && (
          <div className="flex items-center gap-1.5 text-sm font-assistant text-gray-500">
            <span>👥</span>
            <span>{groupLabel(post.target_groups)}</span>
          </div>
        )}
        {post.scheduled_at && (
          <span className="font-assistant text-sm text-h4k-primary font-semibold">
            🕐 {formatDate(post.scheduled_at)}
          </span>
        )}
        {post.sent_at && (
          <span className="font-assistant text-sm text-h4k-secondary font-semibold">
            ✅ נשלח {formatDate(post.sent_at)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {onSchedule && (
          <button onClick={() => onSchedule(post)} className="btn-primary text-sm px-4 py-2">
            <span>🕐</span> תזמן
          </button>
        )}
        {onCancel && (
          <button onClick={() => onCancel(post)} className="btn-ghost text-sm px-4 py-2">
            <span>↩️</span> בטל תזמון
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(post)}
            className="text-sm px-4 py-2 rounded-pill font-fredoka flex items-center gap-2
                       text-red-400 border border-red-200 hover:bg-red-50 transition-all cursor-pointer">
            <span>🗑️</span> מחק
          </button>
        )}
      </div>
    </div>
  );
}
