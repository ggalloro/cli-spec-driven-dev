'use client';

import { useState } from 'react';
import { Feed } from '@/types';

interface FeedManagerProps {
  feeds: Feed[];
  onAddFeed: (feed: Feed) => void;
  onRemoveFeed: (id: string) => void;
}

export default function FeedManager({ feeds, onAddFeed, onRemoveFeed }: FeedManagerProps) {
  const [url, setUrl] = useState('');

  const handleAdd = () => {
    if (!url) return;
    // Mock validation and title fetching
    const newFeed: Feed = {
      id: crypto.randomUUID(),
      url,
      title: `Feed from ${new URL(url).hostname}`,
    };
    onAddFeed(newFeed);
    setUrl('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">RSS Feeds</h2>
      
      <div className="flex gap-2 mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter RSS Feed URL"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          disabled={!url}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Add Feed
        </button>
      </div>

      {feeds.length === 0 ? (
        <p className="text-gray-500 text-center py-4 italic">No feeds added yet.</p>
      ) : (
        <ul className="space-y-3">
          {feeds.map((feed) => (
            <li key={feed.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
              <div className="overflow-hidden">
                <p className="font-medium text-gray-900 truncate">{feed.title}</p>
                <p className="text-sm text-gray-500 truncate">{feed.url}</p>
              </div>
              <button
                onClick={() => onRemoveFeed(feed.id)}
                className="text-red-500 hover:text-red-700 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove feed"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
