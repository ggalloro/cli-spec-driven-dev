'use client';

import { useState, useEffect } from 'react';
import { Play, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

interface Podcast {
  id: number;
  title: string;
  filePath: string;
  duration: number;
  createdAt: string;
  summary?: string;
}

interface PodcastPlayerProps {
    refreshTrigger: number;
}

export default function PodcastPlayer({ refreshTrigger }: PodcastPlayerProps) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);

  const fetchPodcasts = async () => {
    try {
      const res = await axios.get('/api/podcasts');
      setPodcasts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, [refreshTrigger]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Play className="w-5 h-5 text-purple-600" />
        Your Podcasts
      </h2>

      {currentPodcast && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-bold text-lg mb-2">{currentPodcast.title}</h3>
            <audio controls autoPlay src={currentPodcast.filePath} className="w-full" />
            {currentPodcast.summary && (
                <details className="mt-2 text-sm text-gray-600">
                    <summary className="cursor-pointer hover:text-purple-700">View Script Summary</summary>
                    <p className="mt-2 whitespace-pre-wrap">{currentPodcast.summary}</p>
                </details>
            )}
        </div>
      )}

      <div className="space-y-3">
        {podcasts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No podcasts generated yet.</p>
        ) : (
          podcasts.map((podcast) => (
            <div 
                key={podcast.id} 
                className={`flex justify-between items-center p-3 rounded cursor-pointer transition ${currentPodcast?.id === podcast.id ? 'bg-purple-100 border-purple-200 border' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setCurrentPodcast(podcast)}
            >
              <div>
                <h3 className="font-medium">{podcast.title}</h3>
                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(podcast.createdAt).toLocaleDateString()}</span>
                    {podcast.duration > 0 && <span className="flex items-center gap-1"><Clock size={12}/> {Math.round(podcast.duration / 60)}m</span>}
                </div>
              </div>
              <button className="text-purple-600 hover:text-purple-800">
                <Play size={20} fill={currentPodcast?.id === podcast.id ? "currentColor" : "none"} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
