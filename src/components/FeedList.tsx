import React from 'react';

interface Feed {
  id: string;
  url: string;
  title: string;
}

interface FeedListProps {
  feeds: Feed[];
  onRemoveFeed: (id: string) => void;
}

export default function FeedList({ feeds, onRemoveFeed }: FeedListProps) {
  if (feeds.length === 0) {
    return <p className="text-gray-500 italic">No feeds added yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {feeds.map((feed) => (
        <li
          key={feed.id}
          className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200"
        >
          <div className="overflow-hidden">
            <p className="font-medium text-gray-800 truncate">{feed.title || feed.url}</p>
            <p className="text-sm text-gray-500 truncate">{feed.url}</p>
          </div>
          <button
            onClick={() => onRemoveFeed(feed.id)}
            className="text-red-500 hover:text-red-700 ml-4 px-2 py-1"
            aria-label="Remove feed"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
