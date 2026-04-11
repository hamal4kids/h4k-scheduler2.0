import { useState, useEffect, useCallback } from 'react';
import { SHEETS } from '../config';
import { parseCsv } from '../utils/csv';

async function fetchSheet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const text = await res.text();
  return parseCsv(text);
}

export function useSheets() {
  const [posts, setPosts]       = useState([]);
  const [groups, setGroups]     = useState([]);
  const [sentLog, setSentLog]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, g, s] = await Promise.all([
        fetchSheet(SHEETS.posts),
        fetchSheet(SHEETS.groups),
        fetchSheet(SHEETS.sent_log),
      ]);
      setPosts(p);
      setGroups(g);
      setSentLog(s);
      setLastSync(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { posts, groups, sentLog, loading, error, lastSync, refresh };
}
