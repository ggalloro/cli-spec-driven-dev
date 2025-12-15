'use client';

import React, { useState } from 'react';
import FeedInput from '@/components/FeedInput';
import FeedList from '@/components/FeedList';
import AudioPlayer from '@/components/AudioPlayer';
import Image from 'next/image';

interface Feed {
  id: string;
  url: string;
  title: string;
}

interface Podcast {
  id: string;
  url: string;
  duration: number;
  title: string;
}

export default function Home() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(false);
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [error, setError] = useState('');

  const handleAddFeed = (url: string) => {
    // Basic dup check
    if (feeds.some((f) => f.url === url)) {
      alert('Feed already added');
      return;
    }
    const newFeed: Feed = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      title: 'Feed ' + (feeds.length + 1), // Placeholder until we fetch metadata if desired
    };
    setFeeds([...feeds, newFeed]);
  };

  const handleRemoveFeed = (id: string) => {
    setFeeds(feeds.filter((f) => f.id !== id));
  };

  const handleGenerate = async () => {
    if (feeds.length === 0) return;

    setLoading(true);
    setError('');
    setPodcast(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrls: feeds.map((f) => f.url) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate podcast');
      }

      setPodcast(data.podcast);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-64 w-full bg-gray-900">
          <Image
            src="/hero-robot.png"
            alt="AI News Anchor"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <h1 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg text-center px-4">
              AI News Podcast Generator
            </h1>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Feed Management */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Your RSS Feeds</h2>
            <FeedInput onAddFeed={handleAddFeed} />
            <FeedList feeds={feeds} onRemoveFeed={handleRemoveFeed} />
          </section>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-4 pt-4 border-t border-gray-200">
            {error && <div className="text-red-500 font-medium bg-red-50 p-3 rounded-md w-full text-center">{error}</div>}
            
            <button
              onClick={handleGenerate}
              disabled={loading || feeds.length === 0}
              className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-white shadow-md transition-all 
                ${loading || feeds.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Audio...
                </span>
              ) : (
                'Generate Podcast'
              )}
            </button>
          </div>

          {/* Podcast Player */}
          {podcast && (
            <section className="space-y-4 pt-6 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">Your Personalized Podcast</h2>
              <AudioPlayer src={podcast.url} title={podcast.title} />
              <div className="text-center">
                 <a 
                    href={podcast.url} 
                    download 
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline"
                 >
                   Download MP3
                 </a>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}