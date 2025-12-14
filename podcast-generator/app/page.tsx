"use client";
import { useState } from 'react';
import FeedManager from "@/components/FeedManager";
import PodcastGenerator from "@/components/PodcastGenerator";
import PodcastList from "@/components/PodcastList";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column: Feed Management */}
      <section>
        <FeedManager />
      </section>

      {/* Right Column: Player & History */}
      <section className="bg-white p-6 rounded-lg shadow-md min-h-[400px] flex flex-col">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Podcasts</h3>
        
        <PodcastGenerator onGenerate={handleRefresh} />
        
        <div className="flex-1 overflow-y-auto max-h-[600px] mt-4 pr-1">
            <PodcastList refreshTrigger={refreshKey} />
        </div>
      </section>
    </div>
  );
}
