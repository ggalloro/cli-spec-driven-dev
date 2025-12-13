'use client';

import { useState, useEffect } from 'react';
import { Podcast } from '@/lib/storage';

export default function PodcastPlayer({ refreshTrigger }: { refreshTrigger: number }) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch('/api/podcasts');
        if (res.ok) {
          const data = await res.json();
          setPodcasts(data);
          if (data.length > 0 && !currentPodcast) {
             // Optional: Auto-select latest, or leave empty
             // setCurrentPodcast(data[0]); 
          }
        }
      } catch (err) {
        console.error("Failed to fetch podcasts", err);
      }
    };
    fetchPodcasts();
  }, [refreshTrigger]);

  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">Your Daily Digests</h2>

      <div className="flex-1 overflow-y-auto mb-6 space-y-3 pr-2 custom-scrollbar">
        {podcasts.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <p>No podcasts generated yet.</p>
            <p className="text-sm mt-2">Add some feeds and hit Generate!</p>
          </div>
        ) : (
          podcasts.map((podcast) => (
            <button
              key={podcast.id}
              onClick={() => setCurrentPodcast(podcast)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                currentPodcast?.id === podcast.id
                  ? 'bg-emerald-600/20 border-emerald-500/50 ring-1 ring-emerald-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-100">{podcast.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(podcast.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs bg-slate-900/50 px-2 py-1 rounded text-slate-300">
                  {podcast.articlesIncluded} Stories
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {currentPodcast && (
        <div className="mt-auto bg-slate-900/80 p-4 rounded-xl border border-slate-700">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-emerald-400">Now Playing</h3>
            <p className="text-slate-200 truncate">{currentPodcast.title}</p>
          </div>
          <audio 
            controls 
            src={currentPodcast.audioFilePath} 
            className="w-full h-10 mb-3 rounded"
            autoPlay
          />
          <div className="flex justify-end">
            <a 
              href={currentPodcast.audioFilePath} 
              download 
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download MP3
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
