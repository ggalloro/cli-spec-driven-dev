'use client';

import { Podcast } from '@/types';

interface PodcastListProps {
  podcasts: Podcast[];
}

export function PodcastList({ podcasts }: PodcastListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Your Podcasts</h2>
      
      {podcasts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No podcasts generated yet. Add feeds and click Generate!
        </p>
      ) : (
        <div className="space-y-6">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{podcast.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(podcast.createdAt).toLocaleDateString()} • Duration: {Math.floor(podcast.duration / 60)}m {podcast.duration % 60}s
                  </p>
                </div>
                <a
                  href={podcast.filePath}
                  download
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md text-center transition-colors"
                >
                  Download MP3
                </a>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                  {podcast.summary}
                </p>
              </div>

              <audio
                controls
                src={podcast.filePath}
                className="w-full h-10 rounded-lg"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
