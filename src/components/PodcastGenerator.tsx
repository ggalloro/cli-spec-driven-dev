'use client';

import { useState } from 'react';

interface PodcastGeneratorProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

export function PodcastGenerator({ onGenerate, isGenerating }: PodcastGeneratorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Ready to Listen?</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg">
        Generate a personalized podcast from your selected RSS feeds. This process might take a minute as we summarize articles and synthesize audio.
      </p>
      
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`
          px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105
          ${isGenerating 
            ? 'bg-gray-400 cursor-not-allowed animate-pulse' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
          }
        `}
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Podcast...
          </span>
        ) : (
          'Generate Podcast 🎧'
        )}
      </button>
      
      {isGenerating && (
        <p className="mt-4 text-sm text-gray-500 animate-pulse">
          Fetching news, rewriting scripts, and recording audio...
        </p>
      )}
    </div>
  );
}
