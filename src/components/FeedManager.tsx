"use client";

import { useState, useEffect } from 'react';
import { Plus, Trash2, Rss } from 'lucide-react';

interface Feed {
  id: string;
  url: string;
  title: string;
}

export default function FeedManager() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFeeds = async () => {
    try {
      const res = await fetch('/api/feeds');
      const data = await res.json();
      setFeeds(data);
    } catch (err) {
      console.error('Failed to fetch feeds', err);
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
        const data = await res.json();
        throw new Error(data.error || 'Failed to add feed');
      }

      setNewUrl('');
      fetchFeeds();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeed = async (id: string) => {
    if (!confirm('Are you sure you want to remove this feed?')) return;

    try {
      await fetch('/api/feeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchFeeds();
    } catch (err) {
      console.error('Failed to delete feed', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Rss className="w-5 h-5" /> RSS Feeds
      </h2>

      <form onSubmit={handleAddFeed} className="flex gap-2 mb-6">
        <input
          type="url"
          placeholder="Enter RSS Feed URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Adding...' : <><Plus className="w-4 h-4" /> Add</>}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <div className="space-y-3">
        {feeds.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No feeds added yet.</p>
        ) : (
          feeds.map((feed) => (
            <div key={feed.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="overflow-hidden">
                <p className="font-medium truncate">{feed.title}</p>
                <p className="text-xs text-gray-500 truncate">{feed.url}</p>
              </div>
              <button
                onClick={() => handleDeleteFeed(feed.id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                title="Remove feed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
