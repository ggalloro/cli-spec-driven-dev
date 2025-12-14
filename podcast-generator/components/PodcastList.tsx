"use client";

import { useState, useEffect } from 'react';

interface Podcast {
  id: string;
  title: string;
  createdAt: string;
  duration: number;
  audioPath: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transcript?: string;
}

export default function PodcastList({ refreshTrigger }: { refreshTrigger: number }) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    fetch('/api/podcasts')
      .then(res => res.json())
      .then(data => setPodcasts(data))
      .catch(console.error);
  }, [refreshTrigger]);

  return (
    <div className="space-y-4">
      {podcasts.length === 0 && <p className="text-gray-500 text-center py-4">No podcasts generated yet.</p>}
      {podcasts.map(podcast => (
        <div key={podcast.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors bg-white">
          <div className="flex justify-between items-start mb-3">
            <div>
                <h4 className="font-semibold text-gray-800">{podcast.title}</h4>
                <p className="text-xs text-gray-500">{new Date(podcast.createdAt).toLocaleString()}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                podcast.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                podcast.status === 'FAILED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
                {podcast.status}
            </span>
          </div>
          
          {podcast.status === 'COMPLETED' && (
             <div className="mt-3">
                <audio controls className="w-full h-8 mb-2">
                    <source src={podcast.audioPath} type={podcast.audioPath.endsWith('.wav') ? "audio/wav" : "audio/mpeg"} />
                    Your browser does not support the audio element.
                </audio>
                
                {podcast.transcript && (
                  <div className="mt-3 mb-2">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Transcript:</p>
                    <div className="p-3 bg-gray-50 rounded text-sm text-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap border border-gray-100">
                      {podcast.transcript}
                    </div>
                  </div>
                )}

                <div className="flex justify-end items-center gap-3">
                     <span className="text-xs text-gray-400 italic">Audio is simulated</span>
                     <a href={podcast.audioPath} download className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">Download Audio</a>
                </div>
             </div>
          )}
        </div>
      ))}
    </div>
  );
}