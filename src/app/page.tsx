'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { FeedManager } from '@/components/FeedManager';
import { PodcastList } from '@/components/PodcastList';
import { PodcastGenerator } from '@/components/PodcastGenerator';
import { Feed, Podcast } from '@/types';
import { validateFeed, getPodcasts, generatePodcast } from './actions';

export default function Home() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load podcasts on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await getPodcasts();
      setPodcasts(data);
    };
    loadData();
  }, []);

  const handleAddFeed = async (url: string) => {
    setLoadingFeed(true);
    const result = await validateFeed(url);
    if ('error' in result) {
      alert(result.error);
    } else {
      // Check for duplicates
      if (feeds.some(f => f.url === result.url)) {
        alert("Feed already added.");
      } else {
        setFeeds(prev => [...prev, result]);
      }
    }
    setLoadingFeed(false);
  };

  const handleRemoveFeed = (id: string) => {
    setFeeds(prev => prev.filter(f => f.id !== id));
  };

  const handleGenerate = async () => {
    if (feeds.length === 0) {
      alert("Please add at least one RSS feed first.");
      return;
    }

    setIsGenerating(true);
    try {
      const urls = feeds.map(f => f.url);
      const result = await generatePodcast(urls);
      
      if ('error' in result) {
        alert(`Error: ${result.error}`);
      } else {
        // Add new podcast to top of list
        setPodcasts(prev => [result, ...prev]);
        alert("Podcast generated successfully!");
      }
    } catch (e) {
      console.error(e);
      alert("An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎙️</span>
            <h1 className="text-xl font-bold tracking-tight">
              Podcast Generator
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            Powered by Gemini & Google Cloud
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <HeroSection />
        
        <div className="grid gap-8">
          <FeedManager 
            feeds={feeds}
            onAddFeed={handleAddFeed}
            onRemoveFeed={handleRemoveFeed}
            isLoading={loadingFeed}
          />

          <PodcastGenerator 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating} 
          />

          <PodcastList podcasts={podcasts} />
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Podcast Generator AI. Built with Next.js.</p>
      </footer>
    </div>
  );
}
