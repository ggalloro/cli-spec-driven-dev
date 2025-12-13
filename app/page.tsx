'use client';

import { useState } from 'react';
import Image from 'next/image';
import FeedList from './components/FeedList';
import PodcastPlayer from './components/PodcastPlayer';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to reload podcasts
  const [feedsChanged, setFeedsChanged] = useState(0);     // Trigger to reload feeds if needed elsewhere

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) 
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error}`);
        return;
      }
      // Success
      setRefreshTrigger(prev => prev + 1); // Refresh player list
    } catch (error) {
      console.error(error);
      alert('Failed to generate podcast.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Header / Hero */}
      <header className="relative w-full h-[400px] overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
             {/* Fallback color if image missing */}
             <div className="w-full h-full bg-gradient-to-br from-slate-900 to-blue-900/50" />
             <Image 
               src="/hero-robot.png" 
               alt="Robot News Anchor"
               fill
               className="object-cover opacity-60 mix-blend-overlay"
               priority
             />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
        
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 mb-4">
            AI News Anchor
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl">
            Your personalized daily digest, summarized and narrated by AI.
            Powered by Gemini & Google Cloud.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Feeds & Controls (4 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <FeedList onFeedsChange={() => setFeedsChanged(prev => prev + 1)} />
            
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6 rounded-xl border border-blue-500/30">
              <h3 className="text-xl font-bold text-white mb-2">Ready to Listen?</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Compile your latest feed articles into a seamless audio experience.
              </p>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-95 ${
                  isGenerating 
                    ? 'bg-slate-700 cursor-not-allowed animate-pulse text-slate-400'
                    : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-blue-900/20'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Podcast...
                  </span>
                ) : (
                  'Generate New Episode ✨'
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Player & History (8 cols) */}
          <div className="lg:col-span-7 h-[600px]">
            <PodcastPlayer refreshTrigger={refreshTrigger} />
          </div>

        </div>
      </main>
    </div>
  );
}