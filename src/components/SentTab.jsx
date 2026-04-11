import PostCard from './PostCard';

export default function SentTab({ posts, groups }) {
  const sent = posts
    .filter(p => p.status?.trim().toLowerCase() === 'sent')
    .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));

  if (sent.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-3">📤</div>
        <p className="font-varela text-gray-500">עוד לא נשלח שום פוסט</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sent.map(post => (
        <PostCard key={post.id} post={post} groups={groups} />
      ))}
    </div>
  );
}
