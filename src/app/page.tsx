"use client";

import { useState } from 'react';
import Hero from '@/components/Hero';
import FeedManager from '@/components/FeedManager';
import PodcastGenerator from '@/components/PodcastGenerator';
import PodcastList from '@/components/PodcastList';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePodcastGenerated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Hero />
        
        <PodcastGenerator onPodcastGenerated={handlePodcastGenerated} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <FeedManager />
          </div>
          
          <div className="md:col-span-2">
            <PodcastList keyProp={refreshKey} />
          </div>
        </div>
      </div>
    </main>
  );
}