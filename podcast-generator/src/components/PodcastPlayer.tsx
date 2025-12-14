'use client';

import React from 'react';
import { useFeed } from '@/context/FeedContext';

const PodcastPlayer = () => {
  const { podcasts } = useFeed();
  const latestPodcast = podcasts[0]; // For now, just show the latest one

  if (!latestPodcast) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">{latestPodcast.title}</h3>
          <p className="text-sm text-gray-500">
            Generated on {new Date(latestPodcast.createdAt).toLocaleDateString()}
          </p>
        </div>
        <audio controls className="w-full max-w-md" src={latestPodcast.audioUrl}>
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default PodcastPlayer;
