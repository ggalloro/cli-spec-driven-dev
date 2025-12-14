"use client";

import { useState, useEffect } from 'react';

interface Feed {
  id: string;
  url: string;
  title: string;
  addedAt: string;
}

export default function FeedManager() {
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

      await fetchFeeds();
      setNewUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeed = async (id: string) => {
    try {
      const res = await fetch('/api/feeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setFeeds(feeds.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete feed', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">RSS Feeds</h3>
      
      <form onSubmit={handleAddFeed} className="mb-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="feed-url" className="text-sm font-medium text-gray-700">Add New Feed URL</label>
          <div className="flex gap-2">
            <input
              id="feed-url"
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/feed.xml"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </form>

      <div className="space-y-4">
        {feeds.length === 0 ? (
          <p className="text-gray-500 italic">No feeds added yet.</p>
        ) : (
          feeds.map((feed) => (
            <div key={feed.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
              <div className="overflow-hidden">
                <h4 className="font-medium text-gray-900 truncate" title={feed.title}>{feed.title}</h4>
                <p className="text-sm text-gray-500 truncate" title={feed.url}>{feed.url}</p>
              </div>
              <button
                onClick={() => handleDeleteFeed(feed.id)}
                className="text-red-500 hover:text-red-700 ml-4 p-1"
                aria-label="Remove feed"
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
