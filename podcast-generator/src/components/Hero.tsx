import React from 'react';

const Hero = () => {
  return (
    <div className="bg-gray-900 text-white py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">AI News Podcast Generator</h1>
        <p className="text-xl mb-8 text-gray-300">
          Turn your favorite RSS feeds into a personalized daily news podcast using AI.
        </p>
        <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-700 border-dashed">
          <span className="text-gray-500 text-lg">
            [Robot News Anchor Placeholder Image]
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
