'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Mic, Loader2 } from 'lucide-react';
import FeedManager from '@/components/FeedManager';
import PodcastPlayer from '@/components/PodcastPlayer';

export default function Home() {
  const [generating, setGenerating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await axios.post('/api/podcasts/generate');
      setRefreshTrigger(prev => prev + 1); // Refresh podcast list
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to generate podcast. Make sure you have feeds added.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-96 w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-60">
            {/* Make sure public/hero.png exists or this will fail gracefully */}
            <Image 
                src="/hero.png" 
                alt="AI News Anchor" 
                fill 
                style={{ objectFit: 'cover' }}
                priority
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                Your Daily <span className="text-blue-400">AI Briefing</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
                Personalized news podcasts generated from your favorite RSS feeds, powered by Gemini and Google Cloud Chirp.
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* Main Action Area */}
        <div className="mb-12 flex justify-center">
            <button
                onClick={handleGenerate}
                disabled={generating}
                className={`
                    relative group overflow-hidden px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform hover:scale-105 active:scale-95
                    ${generating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'}
                `}
            >
                <div className="flex items-center gap-3">
                    {generating ? (
                        <>
                            <Loader2 className="animate-spin" /> Generating your episode...
                        </>
                    ) : (
                        <>
                            <Mic /> Generate New Episode
                        </>
                    )}
                </div>
            </button>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
            <FeedManager />
            <PodcastPlayer refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </main>
  );
}
