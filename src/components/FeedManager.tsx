'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Rss } from 'lucide-react';
import axios from 'axios';

interface Feed {
  id: number;
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
      const res = await axios.get('/api/feeds');
      setFeeds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const addFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/feeds', { url: newUrl });
      setNewUrl('');
      fetchFeeds();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add feed');
    } finally {
      setLoading(false);
    }
  };

  const deleteFeed = async (id: number) => {
    if (!confirm('Are you sure you want to remove this feed?')) return;
    try {
      await axios.delete(`/api/feeds/${id}`);
      setFeeds(feeds.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete feed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Rss className="w-5 h-5 text-blue-600" />
        RSS Feeds
      </h2>

      <form onSubmit={addFeed} className="flex gap-2 mb-6">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://example.com/rss"
          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Adding...' : <><Plus size={18} /> Add</>}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-3">
        {feeds.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No feeds added yet.</p>
        ) : (
          feeds.map((feed) => (
            <div key={feed.id} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
              <div className="overflow-hidden">
                <h3 className="font-medium truncate">{feed.title}</h3>
                <p className="text-xs text-gray-500 truncate">{feed.url}</p>
              </div>
              <button
                onClick={() => deleteFeed(feed.id)}
                className="text-gray-400 hover:text-red-500 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
