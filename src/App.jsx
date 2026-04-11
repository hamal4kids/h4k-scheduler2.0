import { useState } from 'react';
import { APP_PIN } from './config';
import { useSheets } from './hooks/useSheets';
import PinGate from './components/PinGate';
import Header from './components/Header';
import TabNav from './components/TabNav';
import InboxTab from './components/InboxTab';
import ScheduledTab from './components/ScheduledTab';
import SentTab from './components/SentTab';
import GroupsTab from './components/GroupsTab';

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('h4k_pin') === APP_PIN
  );
  const [tab, setTab] = useState('inbox');
  const { posts, groups, sentLog, loading, error, lastSync, refresh } = useSheets();

  function handleUnlock() {
    sessionStorage.setItem('h4k_pin', APP_PIN);
    setUnlocked(true);
  }

  if (!unlocked) return <PinGate onUnlock={handleUnlock} />;

  const counts = {
    inbox:     posts.filter(p => p.status?.trim().toLowerCase() === 'inbox').length,
    scheduled: posts.filter(p => p.status?.trim().toLowerCase() === 'scheduled').length,
    sent:      posts.filter(p => p.status?.trim().toLowerCase() === 'sent').length,
    groups:    groups.length,
  };

  return (
    <div className="min-h-screen bg-h4k-bg flex flex-col">
      <Header lastSync={lastSync} onRefresh={refresh} loading={loading} />
      <TabNav active={tab} onChange={setTab} counts={counts} />

      <main className="max-w-4xl mx-auto w-full px-4 py-6 flex-1">
        {loading && (
          <div className="text-center py-20">
            <img src="/h4k-scheduler2.0/logo.png" alt="H4K" className="w-16 h-16 object-contain mx-auto mb-3 animate-bounce" />
            <p className="font-varela text-gray-500">טוען נתונים...</p>
          </div>
        )}

        {error && (
          <div className="h4k-card border-2 border-red-200 text-center py-8">
            <p className="font-varela text-red-500">שגיאה בטעינת הנתונים</p>
            <p className="font-assistant text-sm text-gray-400 mt-1">{error}</p>
            <button onClick={refresh} className="btn-primary mt-4 mx-auto">
              <span>🔄</span> נסי שוב
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {tab === 'inbox'     && <InboxTab     posts={posts}  groups={groups} onRefresh={refresh} />}
            {tab === 'scheduled' && <ScheduledTab posts={posts}  groups={groups} onRefresh={refresh} />}
            {tab === 'sent'      && <SentTab      posts={posts}  groups={groups} />}
            {tab === 'groups'    && <GroupsTab    groups={groups} onRefresh={refresh} />}
          </>
        )}
      </main>

      <footer className="bg-h4k-footer text-white text-center py-4">
        <p className="font-assistant text-xs text-white/50">חמ״ל לילדים © 2026 — H4K Scheduler</p>
      </footer>
    </div>
  );
}
