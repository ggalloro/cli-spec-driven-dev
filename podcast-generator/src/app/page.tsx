'use client';

import React from 'react';
import Hero from '@/components/Hero';
import FeedInput from '@/components/FeedInput';
import FeedList from '@/components/FeedList';
import PodcastPlayer from '@/components/PodcastPlayer';
import { FeedProvider, useFeed, Podcast } from '@/context/FeedContext';

const GenerateButton = () => {
  const { feeds, addPodcast } = useFeed();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
        const feedUrls = feeds.map(f => f.url);
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feeds: feedUrls }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate podcast');
        }

        const data = await response.json();
        if (data.success && data.podcast) {
            addPodcast(data.podcast as Podcast);
        } else {
             alert('Failed to generate podcast: ' + (data.error || 'Unknown error'));
        }

    } catch (error) {
        console.error("Generation failed", error);
        alert("An error occurred while generating the podcast.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-12 mb-20">
      <button
        onClick={handleGenerate}
        disabled={feeds.length === 0 || isLoading}
        className={`px-8 py-4 text-lg font-bold text-white rounded-full shadow-lg transition-all transform hover:scale-105 ${
          feeds.length === 0 || isLoading
            ? 'bg-gray-400 cursor-not-allowed hover:scale-100'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Podcast...
          </span>
        ) : (
          'Generate Podcast'
        )}
      </button>
    </div>
  );
};

export default function Home() {
  return (
    <FeedProvider>
      <main className="min-h-screen bg-gray-50 pb-32">
        <Hero />
        <div className="container mx-auto px-4">
          <FeedInput />
          <FeedList />
          <GenerateButton />
        </div>
        <PodcastPlayer />
      </main>
    </FeedProvider>
  );
}
