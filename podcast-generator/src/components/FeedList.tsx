'use client';

import React from 'react';
import { useFeed } from '@/context/FeedContext';

const FeedList = () => {
  const { feeds, removeFeed } = useFeed();

  if (feeds.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No feeds added yet. Add some RSS URLs to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6 max-w-4xl mx-auto px-4">
      {feeds.map((feed) => (
        <div
          key={feed.id}
          className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
        >
          <span className="text-sm text-gray-700 truncate max-w-[200px]" title={feed.url}>
            {feed.title || feed.url}
          </span>
          <button
            onClick={() => removeFeed(feed.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove feed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FeedList;
