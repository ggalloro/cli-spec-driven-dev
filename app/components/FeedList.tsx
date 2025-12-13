'use client';

import { useState, useEffect } from 'react';
import { Feed } from '@/lib/storage';

export default function FeedList({ onFeedsChange }: { onFeedsChange?: () => void }) {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFeeds = async () => {
    try {
      const res = await fetch('/api/feeds');
      if (res.ok) {
        const data = await res.json();
        setFeeds(data);
      }
    } catch (err) {
      console.error("Failed to fetch feeds", err);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to add feed');
      }

      setNewUrl('');
      fetchFeeds();
      if (onFeedsChange) onFeedsChange();
    } catch (err) {
      setError('Could not add feed. Check URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/feeds?id=${id}`, { method: 'DELETE' });
      fetchFeeds();
      if (onFeedsChange) onFeedsChange();
    } catch (err) {
      console.error("Failed to delete feed", err);
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Your News Feeds</h2>
      
      <form onSubmit={handleAddFeed} className="flex gap-2 mb-6">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Enter RSS Feed URL..."
          className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="space-y-3">
        {feeds.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No feeds added yet. Try adding one!</p>
        ) : (
          feeds.map((feed) => (
            <div key={feed.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="overflow-hidden">
                <h3 className="font-semibold text-slate-200 truncate">{feed.title}</h3>
                <p className="text-xs text-slate-500 truncate">{feed.url}</p>
              </div>
              <button
                onClick={() => handleDelete(feed.id)}
                className="ml-4 text-slate-400 hover:text-red-400 transition-colors"
                title="Remove feed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
