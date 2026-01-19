'use client';

interface PodcastGeneratorProps {
  onGenerate: () => void;
  isGenerating: boolean;
  hasFeeds: boolean;
}

export default function PodcastGenerator({ onGenerate, isGenerating, hasFeeds }: PodcastGeneratorProps) {
  return (
    <div className="flex justify-center mb-12">
      <button
        onClick={onGenerate}
        disabled={!hasFeeds || isGenerating}
        className={`
          px-8 py-4 rounded-full text-lg font-bold shadow-lg transform transition-all
          flex items-center gap-3
          ${!hasFeeds || isGenerating 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 hover:shadow-xl'
          }
        `}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Podcast...
          </>
        ) : (
          <>
            <span>Generate Episode</span>
            <span className="text-xl">🎙️</span>
          </>
        )}
      </button>
    </div>
  );
}
