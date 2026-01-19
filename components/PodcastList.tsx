'use client';

import { Podcast } from '@/types';

interface PodcastListProps {
  podcasts: Podcast[];
}

export default function PodcastList({ podcasts }: PodcastListProps) {
  if (podcasts.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Your Podcasts</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {podcasts.map((podcast) => (
          <div key={podcast.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{podcast.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(podcast.createdAt).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {Math.floor(podcast.duration / 60)}:{(podcast.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              
              <audio controls className="w-full mt-2 focus:outline-none">
                <source src={`/podcasts/${podcast.filename}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>

              <div className="mt-4 flex justify-end">
                <a 
                  href={`/podcasts/${podcast.filename}`} 
                  download 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  Download MP3
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
