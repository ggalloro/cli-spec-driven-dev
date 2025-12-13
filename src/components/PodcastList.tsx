"use client";

import { useState, useEffect } from 'react';
import { Play, Download, Clock } from 'lucide-react';

interface Podcast {
  id: string;
  title: string;
  filePath: string;
  createdAt: string;
}

export default function PodcastList({ keyProp }: { keyProp: number }) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch('/api/podcasts');
        const data = await res.json();
        setPodcasts(data);
      } catch (err) {
        console.error('Failed to fetch podcasts', err);
      }
    };

    fetchPodcasts();
  }, [keyProp]); // Refresh when keyProp changes

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Play className="w-5 h-5" /> Your Episodes
      </h2>

      <div className="space-y-4">
        {podcasts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No podcasts generated yet.</p>
        ) : (
          podcasts.map((podcast) => (
            <div key={podcast.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{podcast.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(podcast.createdAt).toLocaleDateString()} at {new Date(podcast.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <a 
                  href={podcast.filePath} 
                  download 
                  className="text-gray-400 hover:text-blue-600 p-1"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
              
              <audio controls className="w-full">
                <source src={podcast.filePath} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
