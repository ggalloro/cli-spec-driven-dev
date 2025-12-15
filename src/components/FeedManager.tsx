'use client';

import { useState } from 'react';
import { Feed } from '@/types';

interface FeedManagerProps {
  feeds: Feed[];
  onAddFeed: (url: string) => void;
  onRemoveFeed: (id: string) => void;
  isLoading?: boolean;
}

export function FeedManager({ feeds, onAddFeed, onRemoveFeed, isLoading = false }: FeedManagerProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddFeed(url.trim());
      setUrl('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">RSS Feed Management</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter RSS Feed URL"
          required
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Feed'}
        </button>
      </form>

      <div className="space-y-3">
        {feeds.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No feeds added yet. Add some RSS URLs to get started!
          </p>
        ) : (
          feeds.map((feed) => (
            <div
              key={feed.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
            >
              <div className="overflow-hidden">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">{feed.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{feed.url}</p>
              </div>
              <button
                onClick={() => onRemoveFeed(feed.id)}
                className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                aria-label={`Remove ${feed.title}`}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
