"use client";

import { useState } from 'react';

export default function PodcastGenerator({ onGenerate }: { onGenerate: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    setStatus('Initializing...');
    
    try {
      const res = await fetch('/api/podcasts/generate', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start');
      const { podcastId } = await res.json();
      
      setStatus('Fetching & Summarizing...');
      
      // Poll
      const interval = setInterval(async () => {
        try {
            const pollRes = await fetch(`/api/podcasts/${podcastId}`);
            if (pollRes.ok) {
            const data = await pollRes.json();
            if (data.status === 'COMPLETED') {
                clearInterval(interval);
                setGenerating(false);
                setStatus('Done!');
                onGenerate(); 
                // Reset status after a delay
                setTimeout(() => setStatus(''), 3000);
            } else if (data.status === 'FAILED') {
                clearInterval(interval);
                setGenerating(false);
                setStatus('Failed.');
            } else {
                // Still pending
            }
            }
        } catch (e) {
            // Ignore poll errors
        }
      }, 2000);
      
    } catch (e) {
      console.error(e);
      setGenerating(false);
      setStatus('Error starting');
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-70 transition-all flex justify-center items-center"
      >
        {generating ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {status}
            </>
        ) : (
          "Generate New Podcast"
        )}
      </button>
    </div>
  );
}
