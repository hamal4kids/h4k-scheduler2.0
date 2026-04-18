import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function renderContent(text) {
  if (!text) return <span className="text-gray-400 italic text-base">אין תוכן</span>;
  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-h4k-primary underline break-all"
          >
            {children}
          </a>
        ),
        p: ({ children }) => <span>{children}</span>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

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
  const [expanded, setExpanded] = useState(false);

  const groupLabel = (ids) => {
    if (!ids || ids === 'ALL') return 'כל הקבוצות';
    return ids.split(',').map(id => {
      const g = groups.find(g => g.id === id.trim());
      return g ? g.name : id.trim();
    }).join(' • ');
  };

  return (
    <div className="h4k-card flex flex-col gap-3">

      {/* Image */}
      {post.media_url && (
        <img
          src={post.media_url}
          alt="תמונה מצורפת"
          className="w-full rounded-2xl object-cover aspect-square"
          loading="lazy"
        />
      )}

      {/* Actions — directly under image */}
      <div className="flex gap-2 flex-wrap">
        {onSchedule && (
          <button onClick={() => onSchedule(post)} className="btn-primary">
            <span>🕐</span> תזמן
          </button>
        )}
        {onCancel && (
          <button onClick={() => onCancel(post)} className="btn-ghost">
            <span>↩️</span> בטל תזמון
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(post)} className="btn-ghost" style={{color:'#ef4444', borderColor:'#fca5a5'}}>
            <span>🗑️</span> מחק
          </button>
        )}
      </div>

      {/* Content — 3-line truncation with expand toggle */}
      <div className="font-varela text-base text-h4k-dark leading-relaxed break-words min-w-0">
        <div className={expanded ? '' : 'line-clamp-3'}>
          {renderContent(post.content)}
        </div>
        {post.content && post.content.length > 120 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-h4k-primary font-assistant text-sm mt-1 hover:underline"
          >
            {expanded ? 'פחות ▲' : 'קרא עוד ▼'}
          </button>
        )}
      </div>

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

    </div>
  );
}
