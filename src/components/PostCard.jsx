function formatDate(str) {
  if (!str) return '';
  try {
    return new Date(str).toLocaleString('he-IL', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return str; }
}

export default function PostCard({ post, groups, onSchedule, onCancel }) {
  const groupLabel = (ids) => {
    if (!ids || ids === 'ALL') return 'כל הקבוצות';
    return ids.split(',').map(id => {
      const g = groups.find(g => g.id === id.trim());
      return g ? g.name : id.trim();
    }).join(' • ');
  };

  return (
    <div className="h4k-card flex flex-col gap-3">
      {/* Source badge */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 text-xs font-assistant px-2.5 py-1 rounded-full
          ${post.source === 'whatsapp' ? 'bg-h4k-secondary/15 text-h4k-secondary' : 'bg-h4k-primary/10 text-h4k-primary'}`}>
          {post.source === 'whatsapp' ? '💬 WhatsApp' : '✏️ ידני'}
        </span>
        {post.scheduled_at && (
          <span className="font-assistant text-xs text-gray-400">{formatDate(post.scheduled_at)}</span>
        )}
        {post.sent_at && (
          <span className="font-assistant text-xs text-gray-400">{formatDate(post.sent_at)}</span>
        )}
      </div>

      {/* Content */}
      <p className="font-assistant text-base text-h4k-dark leading-relaxed line-clamp-3 whitespace-pre-wrap">
        {post.content || <span className="text-gray-400 italic">אין תוכן</span>}
      </p>

      {/* Media */}
      {post.media_url && (
        <a href={post.media_url} target="_blank" rel="noopener noreferrer"
           className="text-h4k-primary font-assistant text-xs underline">
          📎 קובץ מצורף
        </a>
      )}

      {/* Groups */}
      {post.target_groups && (
        <div className="flex items-center gap-1.5 text-xs font-assistant text-gray-500">
          <span>👥</span>
          <span>{groupLabel(post.target_groups)}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-1 flex-wrap">
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
      </div>
    </div>
  );
}
