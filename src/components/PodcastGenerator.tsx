"use client";

import { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';

interface Props {
  onPodcastGenerated: () => void;
}

export default function PodcastGenerator({ onPodcastGenerated }: Props) {
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage('Analyzing feeds & summarizing articles...');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to generate podcast');
      }

      setMessage('Podcast ready!');
      onPodcastGenerated();
    } catch (err) {
      console.error(err);
      setMessage('Error generating podcast.');
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-lg text-white text-center mb-8">
      <h2 className="text-2xl font-bold mb-2">Ready to listen?</h2>
      <p className="mb-6 opacity-90">Generate a new episode from your latest feed updates.</p>
      
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 disabled:opacity-80 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
      >
        {generating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            Generate Podcast
          </>
        )}
      </button>
      
      {message && <p className="mt-4 font-medium animate-pulse">{message}</p>}
    </div>
  );
}
