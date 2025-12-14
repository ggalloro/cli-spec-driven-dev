'use client';

import React, { useState } from 'react';
import { useFeed } from '@/context/FeedContext';

const FeedInput = () => {
  const [url, setUrl] = useState('');
  const { addFeed } = useFeed();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      addFeed(url.trim());
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg mx-auto mt-8">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter RSS Feed URL..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        required
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add
      </button>
    </form>
  );
};

export default FeedInput;
