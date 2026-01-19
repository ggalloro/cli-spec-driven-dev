'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import FeedManager from '@/components/FeedManager';
import PodcastGenerator from '@/components/PodcastGenerator';
import PodcastList from '@/components/PodcastList';
import { Feed, Podcast } from '@/types';

export default function Home() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const res = await fetch('/api/podcasts');
      if (res.ok) {
        const data = await res.json();
        setPodcasts(data);
      }
    } catch (error) {
      console.error('Failed to fetch podcasts', error);
    }
  };

  const handleAddFeed = (feed: Feed) => {
    setFeeds((prev) => [...prev, feed]);
  };

  const handleRemoveFeed = (id: string) => {
    setFeeds((prev) => prev.filter((feed) => feed.id !== id));
  };

  const handleGenerate = async () => {
    if (feeds.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/podcast/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedUrls: feeds.map(f => f.url),
        }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh list
        fetchPodcasts();
        alert('Podcast generated successfully!');
      } else {
        alert('Failed to generate podcast.');
      }

    } catch (error) {
      console.error('Generation failed', error);
      alert('Failed to generate podcast. Check console/logs.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Hero />
        
        <div className="space-y-8">
          <FeedManager 
            feeds={feeds} 
            onAddFeed={handleAddFeed} 
            onRemoveFeed={handleRemoveFeed} 
          />
          
          <PodcastGenerator 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating} 
            hasFeeds={feeds.length > 0} 
          />
          
          <PodcastList podcasts={podcasts} />
        </div>
      </div>
    </main>
  );
}
