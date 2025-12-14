'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Feed {
  id: string;
  url: string;
  title?: string;
}

export interface Podcast {
  id: string;
  createdAt: Date;
  duration: number; // in seconds
  audioUrl: string;
  title: string;
}

interface FeedContextType {
  feeds: Feed[];
  podcasts: Podcast[];
  addFeed: (url: string) => void;
  removeFeed: (id: string) => void;
  addPodcast: (podcast: Podcast) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  const addFeed = (url: string) => {
    // Simple ID generation for now, using URL as a base or random string
    const newFeed: Feed = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      title: url, // Initial title is the URL, can be updated later if needed
    };
    setFeeds((prev) => [...prev, newFeed]);
  };

  const removeFeed = (id: string) => {
    setFeeds((prev) => prev.filter((feed) => feed.id !== id));
  };

  const addPodcast = (podcast: Podcast) => {
    setPodcasts((prev) => [podcast, ...prev]);
  };

  return (
    <FeedContext.Provider value={{ feeds, podcasts, addFeed, removeFeed, addPodcast }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
